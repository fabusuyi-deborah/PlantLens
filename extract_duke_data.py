"""
PlantLens — Dr. Dukes data extractor

What this does:
  1. Reads your plants.json (id + name_scientific for each of the 20 plants).
  2. Reads the relevant tables from the unzipped Duke-Source-CSV export.
  3. Matches each plant to Duke's by GENUS + SPECIES.
  4. Pulls every FARMACY_NEW row (phytochemicals) and ETHNOBOT row (traditional
     uses) for each matched plant, expands PARTS and REFERENCES codes into
     readable text.
  5. Writes duke_extract.json — one RAW pull per plant, grouped and readable,
     but NOT yet in the plants.json phytochemicals[] shape. You still curate
     this by hand: pick the chemicals/uses worth including, write the
     plain-language associated_properties, and confirm the citation — that's
     the step Duke's data can't do for you.

Setup:
  1. Download the zip:  https://ndownloader.figshare.com/files/43363335
  2. Unzip it — you should get a folder of CSVs including FNFTAX.csv,
     FARMACY_NEW.csv, ETHNOBOT.csv, PARTS.csv, REFERENCES.csv.
  3. pip install pandas --break-system-packages   (if not already installed)
  4. Run:
       python extract_duke_data.py --duke-dir ./Duke-Source-CSV --plants plants.json

Output: duke_extract.json, next to wherever you run this from.
"""

import argparse
import json
from pathlib import Path

import pandas as pd


def load_csv(duke_dir: Path, name: str) -> pd.DataFrame:
    path = duke_dir / f"{name}.csv"
    if not path.exists():
        raise FileNotFoundError(
            f"Couldn't find {path}. Check --duke-dir points at the unzipped "
            f"Duke-Source-CSV folder, and that {name}.csv is inside it."
        )
    # Duke's CSVs are inconsistently encoded — latin-1 is the safe fallback.
    return pd.read_csv(path, encoding="latin-1", dtype=str, low_memory=False)


def split_scientific_name(name_scientific: str):
    parts = name_scientific.strip().split()
    genus = parts[0] if len(parts) > 0 else ""
    species = parts[1] if len(parts) > 1 else ""
    return genus, species


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--duke-dir", required=True, help="Path to unzipped Duke-Source-CSV folder")
    ap.add_argument("--plants", required=True, help="Path to plants.json")
    ap.add_argument("--out", default="duke_extract.json", help="Output path")
    args = ap.parse_args()

    duke_dir = Path(args.duke_dir)
    plants = json.loads(Path(args.plants).read_text())

    fnftax = load_csv(duke_dir, "FNFTAX")
    farmacy = load_csv(duke_dir, "FARMACY_NEW")
    ethnobot = load_csv(duke_dir, "ETHNOBOT")
    parts_tbl = load_csv(duke_dir, "PARTS")
    references = load_csv(duke_dir, "REFERENCES")

    # Lookup: plant part code -> readable name
    part_lookup = dict(zip(parts_tbl["PPCO"].str.strip(), parts_tbl["PPNA"].str.strip()))
    # Lookup: short reference code -> full citation
    ref_lookup = dict(zip(references["REFERENCE"].str.strip(), references["LONGREF"].str.strip()))

    fnftax["GENUS_L"] = fnftax["GENUS"].str.strip().str.lower()
    fnftax["SPECIES_L"] = fnftax["SPECIES"].str.strip().str.lower()
    ethnobot["GENUS_L"] = ethnobot["GENUS"].str.strip().str.lower()
    ethnobot["SPECIES_L"] = ethnobot["SPECIES"].str.strip().str.lower()

    result = {}
    unmatched = []

    for plant in plants:
        genus, species = split_scientific_name(plant["name_scientific"])
        genus_l, species_l = genus.lower(), species.lower()

        tax_matches = fnftax[(fnftax["GENUS_L"] == genus_l) & (fnftax["SPECIES_L"] == species_l)]
        fnfnums = tax_matches["FNFNUM"].dropna().unique().tolist()

        chem_rows = farmacy[farmacy["FNFNUM"].isin(fnfnums)] if fnfnums else farmacy.iloc[0:0]
        ethno_rows = ethnobot[(ethnobot["GENUS_L"] == genus_l) & (ethnobot["SPECIES_L"] == species_l)]

        if not fnfnums and ethno_rows.empty:
            unmatched.append(plant["id"])

        def resolve_farmacy_reference(row):
            code = str(row.get("REFERENCE", "")).strip()
            looked_up = ref_lookup.get(code, "")
            if looked_up:
                return looked_up
            return f"[unresolved reference code: {code}]" if code else ""

        phytochemicals_raw = [
            {
                "compound": row.get("CHEM", ""),
                "part": part_lookup.get(str(row.get("PPCO", "")).strip(), row.get("PPCO", "")),
                "amount_low_ppm": row.get("AMT_LO", ""),
                "amount_high_ppm": row.get("AMT_HI", ""),
                "reference_code": row.get("REFERENCE", ""),
                "reference_full": resolve_farmacy_reference(row),
            }
            for _, row in chem_rows.iterrows()
        ]

        def resolve_reference(row):
            # pandas reads blank cells as NaN (a float), and NaN is truthy in
            # Python, so a plain `x or y` fallback silently returns NaN
            # instead of falling through. Check explicitly instead.
            longref = row.get("LONGREF")
            if isinstance(longref, str) and longref.strip():
                return longref.strip()
            code = str(row.get("REFERENCE", "")).strip()
            looked_up = ref_lookup.get(code, "")
            if looked_up:
                return looked_up
            # Nothing resolved — surface the raw code so it's still visible
            # to you rather than silently disappearing as an empty string.
            return f"[unresolved reference code: {code}]" if code else ""

        ethnobotany_raw = [
            {
                "activity": row.get("ACTIVITY", ""),
                "country": row.get("COUNTRY", ""),
                "reference_code": row.get("REFERENCE", ""),
                "reference_full": resolve_reference(row),
            }
            for _, row in ethno_rows.iterrows()
        ]

        result[plant["id"]] = {
            "name_scientific": plant["name_scientific"],
            "fnfnums_matched": fnfnums,
            "phytochemicals_raw": phytochemicals_raw,
            "ethnobotany_raw": ethnobotany_raw,
        }

    Path(args.out).write_text(json.dumps(result, indent=2))

    print(f"Wrote {args.out}")
    for pid, data in result.items():
        print(f"  {pid}: {len(data['phytochemicals_raw'])} chemical rows, "
              f"{len(data['ethnobotany_raw'])} ethnobotanical rows")
    if unmatched:
        print("\nNo match found in Duke's for these — check spelling/synonyms manually:")
        for pid in unmatched:
            print(f"  - {pid}")


if __name__ == "__main__":
    main()