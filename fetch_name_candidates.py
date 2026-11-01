"""
PlantLens — local name candidate finder

What this does, in two steps:

  1. candidates — Looks up every plant in plants.json on Wikidata by
     name_scientific and collects its names in Swahili, Akan (Twi), Fula, Wolof
     and Zulu: the item's label, its aliases and its "taxon common name"
     (P1843) values. A language is only looked up for plants whose regions
     include where it's spoken, so bitter kola gets no Zulu row. Writes:
       - name_candidates.csv : one row per candidate, with "keep", "name" and
                               "source_citation" columns for you to fill in

  2. apply — Adds every row marked keep=y to that plant's names_local in
     plants.json, with its source_citation. Rows without a citation are
     refused. Names already on the plant are skipped, so you can run this
     again as you confirm more.

Wikidata is a lead, not a source. Confirm each name in PROTA4U, Kokwaro,
Burkill or PlantZAfrica, then put that reference in source_citation. You can
also add your own rows to the CSV for names you find in those books that
Wikidata doesn't have: fill in plant_id, language, name, source_citation and
keep=y.

Setup: none beyond Python 3.8+ (standard library only).

Run:
  python fetch_name_candidates.py candidates
  # open name_candidates.csv, set keep=y, fix "name" if needed, add source_citation
  python fetch_name_candidates.py apply
"""

from __future__ import annotations

import argparse
import csv
import json
import ssl
import sys
import urllib.parse
import urllib.request
from pathlib import Path

USER_AGENT = "PlantLensNameFinder/1.0 (personal educational project; Python urllib)"
SPARQL_URL = "https://query.wikidata.org/sparql"

# Wikidata language code -> (label used in plants.json, regions where it's spoken).
LANGUAGES = {
    "sw": ("Swahili", {"east", "central"}),
    "ak": ("Akan (Twi)", {"west"}),
    "tw": ("Akan (Twi)", {"west"}),
    "ff": ("Fula", {"west"}),
    "wo": ("Wolof", {"west"}),
    "zu": ("Zulu", {"southern"}),
}

FIELDS = [
    "plant_id", "name_scientific", "language", "candidate", "found_as", "wikidata_item",
    "keep", "name", "source_citation",
]


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


def build_query(scientific_names: list[str]) -> str:
    values = " ".join(json.dumps(name) for name in scientific_names)
    codes = ", ".join(json.dumps(code) for code in LANGUAGES)
    return f"""
SELECT ?taxon ?item ?name ?kind WHERE {{
  VALUES ?taxon {{ {values} }}
  ?item wdt:P225 ?taxon .
  {{ ?item rdfs:label ?name . BIND("label" AS ?kind) }}
  UNION {{ ?item skos:altLabel ?name . BIND("alias" AS ?kind) }}
  UNION {{ ?item wdt:P1843 ?name . BIND("common name" AS ?kind) }}
  FILTER(LANG(?name) IN ({codes}))
}}"""


def run_query(query: str) -> list[dict]:
    url = f"{SPARQL_URL}?{urllib.parse.urlencode({'query': query, 'format': 'json'})}"
    request = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json"}
    )
    with urllib.request.urlopen(request, timeout=60, context=SSL_CONTEXT) as response:
        return json.load(response)["results"]["bindings"]


def candidate_rows(plants: list[dict], bindings: list[dict]) -> list[dict]:
    """Turns SPARQL results into CSV rows, keeping only languages spoken where each plant grows."""
    by_scientific = {plant["name_scientific"]: plant for plant in plants}
    rows, seen = [], set()
    for binding in bindings:
        plant = by_scientific.get(binding["taxon"]["value"])
        name = binding["name"]["value"].strip()
        code = binding["name"].get("xml:lang", "")
        if not plant or code not in LANGUAGES:
            continue
        language, spoken_in = LANGUAGES[code]
        if not spoken_in & set(plant.get("regions", [])):
            continue
        # Wikidata often copies the botanical name in as the label; that's not a local name.
        if name.lower() == plant["name_scientific"].lower():
            continue
        key = (plant["id"], language, name.lower())
        if key in seen:
            continue
        seen.add(key)
        rows.append({
            "plant_id": plant["id"],
            "name_scientific": plant["name_scientific"],
            "language": language,
            "candidate": name,
            "found_as": binding["kind"]["value"],
            "wikidata_item": binding["item"]["value"],
            "keep": "",
            "name": name,
            "source_citation": "",
        })
    order = {plant["id"]: i for i, plant in enumerate(plants)}
    rows.sort(key=lambda row: (order[row["plant_id"]], row["language"], row["candidate"].lower()))
    return rows


def cmd_candidates(args):
    plants = json.loads(Path(args.plants).read_text(encoding="utf-8"))
    print(f"Querying Wikidata for {len(plants)} plants…")
    bindings = run_query(build_query([plant["name_scientific"] for plant in plants]))
    rows = candidate_rows(plants, bindings)

    with open(args.out, "w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    found = {row["plant_id"] for row in rows}
    print(f"Wrote {len(rows)} candidates for {len(found)} plants to {args.out}")
    missing = [plant["id"] for plant in plants if plant["id"] not in found]
    if missing:
        print("No candidates for:", ", ".join(missing))
        print("  (Wikidata may file some under a different botanical name, e.g. Gymnanthemum")
        print("  amygdalinum for bitter leaf. Look those up by hand.)")


def apply_rows(plants: list[dict], rows: list[dict]) -> tuple[int, list[str]]:
    """Adds kept rows to plants in place. Returns how many were added and any problems."""
    by_id = {plant["id"]: plant for plant in plants}
    added, problems = 0, []
    for line, row in enumerate(rows, start=2):
        if (row.get("keep") or "").strip().lower() not in {"y", "yes"}:
            continue
        plant = by_id.get((row.get("plant_id") or "").strip())
        name = (row.get("name") or "").strip()
        language = (row.get("language") or "").strip()
        citation = (row.get("source_citation") or "").strip()
        if not plant:
            problems.append(f"line {line}: unknown plant_id {row.get('plant_id')!r}")
            continue
        if not name or not language:
            problems.append(f"line {line}: needs both language and name")
            continue
        if not citation:
            problems.append(f"line {line}: {plant['id']} / {language} '{name}' has no source_citation")
            continue
        existing = {(entry["language"], entry["name"].lower()) for entry in plant["names_local"]}
        if (language, name.lower()) in existing:
            continue
        plant["names_local"].append({"language": language, "name": name, "source_citation": citation})
        added += 1
    return added, problems


def cmd_apply(args):
    plants_path = Path(args.plants)
    plants = json.loads(plants_path.read_text(encoding="utf-8"))
    with open(args.csv, newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))

    added, problems = apply_rows(plants, rows)
    for problem in problems:
        print("Skipped", problem)
    if added:
        plants_path.write_text(json.dumps(plants, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Added {added} names to {plants_path}")
    if problems:
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Find and apply local plant names from Wikidata")
    ap.add_argument("--plants", default="plants.json")
    sub = ap.add_subparsers(dest="command", required=True)

    candidates = sub.add_parser("candidates", help="Look up name candidates on Wikidata")
    candidates.add_argument("--out", default="name_candidates.csv")
    candidates.set_defaults(func=cmd_candidates)

    apply = sub.add_parser("apply", help="Add the names you kept to plants.json")
    apply.add_argument("--csv", default="name_candidates.csv")
    apply.set_defaults(func=cmd_apply)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
