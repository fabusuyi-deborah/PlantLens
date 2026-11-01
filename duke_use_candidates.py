"""
PlantLens — African traditional uses from Dr. Duke's

What this does, in two steps:

  1. candidates — Reads duke_extract.json (made by extract_duke_data.py) and
     lists every traditional use Dr. Duke's records in an African country
     other than Nigeria, one row per plant + use + reference, with all the
     countries that reference gives for it. Writes:
       - use_candidates.csv : with "keep", "title", "use" and
                              "source_citation" columns for you to fill in

  2. apply — Adds every row marked keep=y to that plant's traditional_uses in
     plants.json. You write "use" yourself, in plain language, naming the
     country ("Used in Ghana to treat coughs."), so the plant page tags it
     with that region. source_citation comes prefilled from Duke's reference;
     tidy it to match the others. Rows without a use or a citation are
     refused, and uses a plant already has are skipped, so it's safe to run
     again.

Rows marked "maybe" in already_on_plant look like a use the plant already
has (same reference, country and ailment). Check before keeping them.

Setup: none beyond Python 3.8+ (standard library only). Needs
duke_extract.json, which is in the repo.

Run:
  python duke_use_candidates.py candidates
  # open use_candidates.csv: set keep=y, write "use", check source_citation
  python duke_use_candidates.py apply

Want Nigerian rows too? python duke_use_candidates.py candidates --include-nigeria
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

# Duke's country labels in Africa -> the name to use in PlantLens text.
AFRICAN_COUNTRIES = {
    "Africa": "Africa",
    "Africa(Pemba)": "Pemba (Tanzania)",
    "Africa(Swahili)": "East Africa (Swahili speakers)",
    "Angola": "Angola",
    "C Africa": "Central Africa",
    "Egypt": "Egypt",
    "Ethiopia": "Ethiopia",
    "Ghana": "Ghana",
    "Guinea": "Guinea",
    "Ivory Coast": "Ivory Coast",
    "Malagasy": "Madagascar",
    "Mauritius": "Mauritius",
    "Mozambique": "Mozambique",
    "Nigeria": "Nigeria",
    "S Africa": "southern Africa",
    "Senegal": "Senegal",
    "Sierra Leone": "Sierra Leone",
    "South Africa": "South Africa",
    "Sudan": "Sudan",
    "Tanzania": "Tanzania",
    "Upper Volta": "Burkina Faso (then Upper Volta)",
    "W Africa": "West Africa",
    "Zaire": "DR Congo (then Zaire)",
}

DUKE_SUFFIX = " — via Duke's Ethnobotanical Database"

FIELDS = [
    "plant_id", "name_scientific", "activity", "countries", "reference", "already_on_plant",
    "keep", "title", "use", "source_citation",
]


def clean(value) -> str:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return ""
    return str(value).strip()


def first_author(reference: str) -> str:
    """'Ayensu, E.S. 1978. Medicinal…' -> 'ayensu'."""
    match = re.match(r"\s*([A-Za-zÀ-ÿ'\-]+)", reference)
    return match.group(1).lower() if match else ""


def ailment_word(activity: str) -> str:
    """'Cold(Head)' -> 'cold', 'Chest-Cold' -> 'chest'."""
    return re.split(r"[\s(\-/]", activity.lower(), maxsplit=1)[0]


def looks_already_added(plant: dict, activity: str, countries: list[str], reference: str) -> bool:
    author = first_author(reference)
    word = ailment_word(activity)
    for item in plant.get("traditional_uses", []):
        text = f"{item.get('title', '')} {item['use']}".lower()
        if (
            author
            and author in item["source_citation"].lower()
            and word in text
            and any(country.split(" (")[0].lower() in text for country in countries)
        ):
            return True
    return False


def candidate_rows(plants: list[dict], extract: dict, include_nigeria: bool) -> list[dict]:
    by_id = {plant["id"]: plant for plant in plants}
    grouped: dict[tuple[str, str, str], dict] = {}

    for plant_id, data in extract.items():
        plant = by_id.get(plant_id)
        if not plant:
            continue
        for row in data.get("ethnobotany_raw", []):
            country = AFRICAN_COUNTRIES.get(clean(row.get("country")))
            activity = clean(row.get("activity"))
            if not country or not activity:
                continue
            if country == "Nigeria" and not include_nigeria:
                continue
            reference = clean(row.get("reference_full")) or clean(row.get("reference_code"))
            key = (plant_id, activity, reference)
            entry = grouped.setdefault(key, {"plant": plant, "countries": []})
            if country not in entry["countries"]:
                entry["countries"].append(country)

    rows = []
    for (plant_id, activity, reference), entry in grouped.items():
        plant, countries = entry["plant"], entry["countries"]
        rows.append({
            "plant_id": plant_id,
            "name_scientific": plant["name_scientific"],
            "activity": activity,
            "countries": "; ".join(countries),
            "reference": reference,
            "already_on_plant": "maybe" if looks_already_added(plant, activity, countries, reference) else "",
            "keep": "",
            "title": "",
            "use": "",
            "source_citation": f"{reference}{DUKE_SUFFIX}" if reference else "",
        })

    order = {plant["id"]: i for i, plant in enumerate(plants)}
    rows.sort(key=lambda row: (order[row["plant_id"]], row["countries"], row["activity"].lower()))
    return rows


def cmd_candidates(args):
    plants = json.loads(Path(args.plants).read_text(encoding="utf-8"))
    extract_path = Path(args.extract)
    if not extract_path.exists():
        sys.exit(f"{extract_path} not found. Run extract_duke_data.py first (see README).")
    # Duke's data has NaN for empty cells, which Python's json reads fine.
    extract = json.loads(extract_path.read_text(encoding="utf-8"))

    rows = candidate_rows(plants, extract, args.include_nigeria)
    with open(args.out, "w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    counts: dict[str, int] = {}
    for row in rows:
        counts[row["plant_id"]] = counts.get(row["plant_id"], 0) + 1
    print(f"Wrote {len(rows)} candidate uses to {args.out}")
    for plant in plants:
        print(f"  {plant['id']:<14} {counts.get(plant['id'], 0)}")
    maybe = sum(1 for row in rows if row["already_on_plant"])
    if maybe:
        print(f"{maybe} look like uses a plant already has (already_on_plant = maybe).")


def apply_rows(plants: list[dict], rows: list[dict]) -> tuple[int, list[str]]:
    """Adds kept rows to plants in place. Returns how many were added and any problems."""
    by_id = {plant["id"]: plant for plant in plants}
    added, problems = 0, []
    for line, row in enumerate(rows, start=2):
        if (row.get("keep") or "").strip().lower() not in {"y", "yes"}:
            continue
        plant = by_id.get((row.get("plant_id") or "").strip())
        use = (row.get("use") or "").strip()
        title = (row.get("title") or "").strip()
        citation = (row.get("source_citation") or "").strip()
        if not plant:
            problems.append(f"line {line}: unknown plant_id {row.get('plant_id')!r}")
            continue
        if not use:
            problems.append(f"line {line}: {plant['id']} / {row.get('activity')} is kept but has no 'use' written")
            continue
        if not citation:
            problems.append(f"line {line}: {plant['id']} / {row.get('activity')} has no source_citation")
            continue
        if any(item["use"].strip().lower() == use.lower() for item in plant["traditional_uses"]):
            continue
        entry = {"title": title} if title else {}
        entry.update({"use": use, "source_citation": citation})
        plant["traditional_uses"].append(entry)
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
    print(f"Added {added} uses to {plants_path}")
    if problems:
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="List and apply African traditional uses from Dr. Duke's")
    ap.add_argument("--plants", default="plants.json")
    sub = ap.add_subparsers(dest="command", required=True)

    candidates = sub.add_parser("candidates", help="List candidate uses from duke_extract.json")
    candidates.add_argument("--extract", default="duke_extract.json")
    candidates.add_argument("--out", default="use_candidates.csv")
    candidates.add_argument("--include-nigeria", action="store_true", help="Also list Nigerian uses")
    candidates.set_defaults(func=cmd_candidates)

    apply = sub.add_parser("apply", help="Add the uses you kept to plants.json")
    apply.add_argument("--csv", default="use_candidates.csv")
    apply.set_defaults(func=cmd_apply)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
