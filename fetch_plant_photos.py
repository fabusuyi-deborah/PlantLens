"""
PlantLens — plant photo fetcher

What this does, in two steps:

  1. candidates — For each plant in plants.json, searches Wikimedia Commons
     (species category + keyword search) and iNaturalist by name_scientific for
     openly licensed photos (CC0, public domain, CC BY, CC BY-SA only). Writes:
       - photo_candidates.json : every candidate, numbered per plant, with a
                                 "pick" field you fill in
       - photo_review.html     : open in a browser to eyeball the candidates
                                 side by side with their numbers

  2. apply — For each plant whose "pick" you've set, downloads that photo to
     public/plants/<id>-<hash>.jpg and updates plants.json with photo_url and
     photo_credit (author, license, source_url). Plants left with "pick": null
     are skipped, so you can run this again as you pick more.

The picking step is deliberately manual: automatic "first result" picks often
land on herbarium sheets, seed close-ups or mislabelled uploads.

Attribution: CC BY and CC BY-SA photos legally require crediting the author
and license. photo_credit holds exactly that — show it somewhere in the app.

Setup: none beyond Python 3.8+ (standard library only).

Run:
  python fetch_plant_photos.py candidates
  # open photo_review.html, then set "pick": <number> per plant in photo_candidates.json
  python fetch_plant_photos.py apply

Didn't like any of the options for some plants? Search again for just those,
with more results and without the photos you've already seen:
  python fetch_plant_photos.py candidates --unpicked-only --per-source 10
"""

import argparse
import hashlib
import html
import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

USER_AGENT = "PlantLensPhotoFetcher/1.0 (personal educational project; Python urllib)"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
INAT_API = "https://api.inaturalist.org/v1"

# Commons only serves thumbnails at standard widths; 1280 is plenty for cards and the details page.
COMMONS_WIDTH = 1280

FREE_LICENSE = re.compile(r"^(cc0|public domain|pd|cc by(-sa)? [\d.]+)", re.IGNORECASE)
INAT_LICENSES = {"cc0": "CC0", "cc-by": "CC BY 4.0", "cc-by-sa": "CC BY-SA 4.0"}


def make_ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context()
    if context.get_ca_certs():
        return context
    # Some Python builds (e.g. MSYS2's) ship with no CA certificates at all, so every
    # HTTPS request fails verification. Fall back to certifi or Git for Windows' bundle.
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    git_bundle = Path(r"C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt")
    if git_bundle.exists():
        return ssl.create_default_context(cafile=str(git_bundle))
    return context


SSL_CONTEXT = make_ssl_context()


def fetch(url: str, timeout: int = 30):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    return urllib.request.urlopen(request, timeout=timeout, context=SSL_CONTEXT)


def get_json(url: str, params: dict) -> dict:
    with fetch(f"{url}?{urllib.parse.urlencode(params)}") as response:
        return json.load(response)


def strip_html(text: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def commons_files(params: dict, limit: int, seen: set) -> list:
    """Openly licensed bitmap files from a Commons query whose generator yields File: pages."""
    data = get_json(COMMONS_API, {
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
        "iiurlwidth": COMMONS_WIDTH,
        **params,
    })
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0))

    candidates = []
    for page in pages:
        info = page.get("imageinfo", [{}])[0]
        if info.get("mime") not in ("image/jpeg", "image/png", "image/webp"):
            continue
        meta = info.get("extmetadata", {})
        license_name = strip_html(meta.get("LicenseShortName", {}).get("value", ""))
        if not FREE_LICENSE.match(license_name) or info["descriptionurl"] in seen:
            continue
        # Some older files have no Artist field; Credit sometimes names the photographer instead.
        author = strip_html(meta.get("Artist", {}).get("value", "")) or strip_html(
            meta.get("Credit", {}).get("value", "")
        )
        candidates.append({
            "source": "Wikimedia Commons",
            "image_url": info.get("thumburl") or info["url"],
            "source_url": info["descriptionurl"],
            "author": author or "Unknown",
            "license": license_name,
            "title": page["title"],
        })
        if len(candidates) == limit:
            break
    return candidates


def commons_search_candidates(name_scientific: str, limit: int, seen: set) -> list:
    return commons_files({
        "generator": "search",
        "gsrsearch": f'"{name_scientific}" filetype:bitmap',
        "gsrnamespace": 6,  # File: namespace
        "gsrlimit": 50,
    }, limit, seen)


def commons_category_candidates(name_scientific: str, limit: int, seen: set) -> list:
    # Species categories (e.g. Category:Carica papaya) are curated by editors, so they
    # tend to hold better photos than a keyword search turns up.
    return commons_files({
        "generator": "categorymembers",
        "gcmtitle": f"Category:{name_scientific}",
        "gcmtype": "file",
        "gcmlimit": 100,
    }, limit, seen)


def inaturalist_candidates(name_scientific: str, limit: int, seen: set) -> list:
    taxa = get_json(f"{INAT_API}/taxa", {"q": name_scientific, "per_page": 5})["results"]
    if not taxa:
        return []
    # Prefer an exact name match; otherwise iNaturalist's top hit (it resolves synonyms,
    # e.g. Vernonia amygdalina -> Gymnanthemum amygdalinum).
    taxon = next((t for t in taxa if t["name"].lower() == name_scientific.lower()), taxa[0])

    observations = get_json(f"{INAT_API}/observations", {
        "taxon_id": taxon["id"],
        "quality_grade": "research",
        "photo_license": ",".join(INAT_LICENSES),
        "photos": "true",
        "order_by": "votes",
        "per_page": 100,
    })["results"]

    candidates = []
    for observation in observations:
        photo = next((p for p in observation["photos"] if p.get("license_code") in INAT_LICENSES), None)
        if photo is None:
            continue
        source_url = f"https://www.inaturalist.org/photos/{photo['id']}"
        if source_url in seen:
            continue
        user = observation.get("user") or {}
        candidates.append({
            "source": "iNaturalist",
            "image_url": photo["url"].replace("/square.", "/large."),
            "source_url": source_url,
            "author": user.get("name") or user.get("login") or "Unknown",
            "license": INAT_LICENSES[photo["license_code"]],
            "title": f"Observation {observation['id']} ({taxon['name']})",
        })
        if len(candidates) == limit:
            break
    return candidates


def write_review_page(candidates_by_plant: dict, out_path: Path):
    sections = []
    for plant_id, entry in candidates_by_plant.items():
        cards = "".join(
            f'<figure><a href="{html.escape(c["source_url"])}" target="_blank">'
            f'<img src="{html.escape(c["image_url"])}" loading="lazy"></a>'
            f'<figcaption><b>#{c["n"]}</b> {html.escape(c["source"])} · {html.escape(c["license"])}'
            f'<br>{html.escape(c["author"][:60])}</figcaption></figure>'
            for c in entry["candidates"]
        ) or "<p>No openly licensed candidates found — source this one by hand.</p>"
        sections.append(
            f'<h2>{html.escape(plant_id)} <small><i>{html.escape(entry["name_scientific"])}</i></small></h2>'
            f'<div class="grid">{cards}</div>'
        )
    out_path.write_text(
        "<!doctype html><meta charset=utf-8><title>PlantLens photo review</title><style>"
        "body{font-family:system-ui;margin:24px;background:#f6f6f3;color:#222}"
        "h2{margin-top:40px}small{font-weight:normal;color:#666}"
        ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}"
        "figure{margin:0;background:#fff;border-radius:8px;overflow:hidden}"
        "img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}"
        "figcaption{padding:8px;font-size:13px}</style>"
        "<h1>PlantLens photo review</h1><p>Set <code>\"pick\": &lt;number&gt;</code> for each plant "
        "in photo_candidates.json, then run <code>python fetch_plant_photos.py apply</code>.</p>"
        + "".join(sections),
        encoding="utf-8",
    )


def cmd_candidates(args):
    plants = json.loads(Path(args.plants).read_text(encoding="utf-8"))
    out_path = Path(args.candidates)
    # Keep picks from a previous run so re-running doesn't wipe your choices.
    previous = json.loads(out_path.read_text(encoding="utf-8")) if out_path.exists() else {}

    searches = (commons_category_candidates, commons_search_candidates, inaturalist_candidates)
    candidates_by_plant = {}
    for plant in plants:
        name = plant["name_scientific"]
        entry = previous.get(plant["id"], {})
        if args.unpicked_only and entry.get("pick") is not None:
            candidates_by_plant[plant["id"]] = entry
            continue
        # When re-searching unpicked plants, leave out the photos already shown and passed over.
        seen = {c["source_url"] for c in entry.get("candidates", [])} if args.unpicked_only else set()

        print(f"Searching {plant['id']} ({name})...")
        found = []
        for search in searches:
            try:
                results = search(name, args.per_source, seen)
            except Exception as error:  # one flaky source shouldn't sink the whole run
                print(f"  {search.__name__} failed: {error}")
                results = []
            found += results
            seen |= {c["source_url"] for c in results}  # category and search often overlap
            time.sleep(1)  # be polite to both APIs
        for n, candidate in enumerate(found, start=1):
            candidate["n"] = n
        print(f"  {len(found)} candidates")
        candidates_by_plant[plant["id"]] = {
            "name_scientific": name,
            "pick": entry.get("pick"),
            "candidates": found,
        }

    out_path.write_text(json.dumps(candidates_by_plant, indent=2, ensure_ascii=False), encoding="utf-8")
    to_review = {
        plant_id: entry for plant_id, entry in candidates_by_plant.items()
        if not args.unpicked_only or entry.get("pick") is None
    }
    write_review_page(to_review, Path(args.review))
    print(f"\nWrote {out_path} and {args.review}. Open the review page, set picks, then run: apply")


def cmd_apply(args):
    plants_path = Path(args.plants)
    plants = json.loads(plants_path.read_text(encoding="utf-8"))
    candidates_by_plant = json.loads(Path(args.candidates).read_text(encoding="utf-8"))
    photo_dir = Path(args.photo_dir)
    photo_dir.mkdir(parents=True, exist_ok=True)

    updated = 0
    for plant in plants:
        entry = candidates_by_plant.get(plant["id"])
        if not entry or entry.get("pick") is None:
            continue
        chosen = next((c for c in entry["candidates"] if c["n"] == entry["pick"]), None)
        if chosen is None:
            print(f"{plant['id']}: pick #{entry['pick']} doesn't exist, skipping")
            continue

        # The source goes into the filename so a different photo always gets a new URL; Next.js
        # caches optimized images by URL (4 hours by default), so reusing a name shows the old photo.
        filename = f"{plant['id']}-{hashlib.sha1(chosen['source_url'].encode()).hexdigest()[:8]}.jpg"
        photo_url = f"/plants/{filename}"
        if plant.get("photo_url") == photo_url and (photo_dir / filename).exists():
            continue  # already applied

        old_file = photo_dir / Path(plant.get("photo_url") or "").name
        same_photo = plant.get("photo_credit", {}).get("source_url") == chosen["source_url"]
        if same_photo and old_file.is_file():
            # Same photo under an old-style name: just rename, keeping any hand edits to photo_credit.
            old_file.rename(photo_dir / filename)
        else:
            with fetch(chosen["image_url"], timeout=60) as response:
                (photo_dir / filename).write_bytes(response.read())
            if old_file.is_file():
                old_file.unlink()
            plant["photo_credit"] = {
                "author": chosen["author"],
                "license": chosen["license"],
                "source_url": chosen["source_url"],
            }
            if chosen["author"] == "Unknown":
                print(f"  WARNING: no author on record. Check {chosen['source_url']} and fill in "
                      f"photo_credit.author in plants.json by hand.")
            time.sleep(1)
        plant["photo_url"] = photo_url
        updated += 1
        print(f"{plant['id']}: saved #{chosen['n']} from {chosen['source']} ({chosen['license']})")

    # Match plants.json's existing formatting: 2-space indent, raw non-ASCII, no trailing newline.
    plants_path.write_text(json.dumps(plants, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nUpdated {updated} plants in {plants_path}")


def main():
    ap = argparse.ArgumentParser(description="Find and apply openly licensed plant photos")
    ap.add_argument("--plants", default="plants.json", help="Path to plants.json")
    ap.add_argument("--candidates", default="photo_candidates.json", help="Candidates file")
    sub = ap.add_subparsers(dest="command", required=True)

    candidates = sub.add_parser("candidates", help="Search for photo candidates")
    candidates.add_argument("--review", default="photo_review.html", help="Review page output path")
    candidates.add_argument("--per-source", type=int, default=5, help="Max candidates from each source")
    candidates.add_argument(
        "--unpicked-only", action="store_true",
        help="Only re-search plants without a pick, skipping photos already shown for them",
    )
    candidates.set_defaults(func=cmd_candidates)

    apply = sub.add_parser("apply", help="Download picked photos and update plants.json")
    apply.add_argument("--photo-dir", default="public/plants", help="Where to save photos")
    apply.set_defaults(func=cmd_apply)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
