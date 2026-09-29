"""
PlantLens — Duke's extract summarizer

Takes duke_extract.json (raw rows) and collapses it into, per plant:
  - distinct compounds, ranked by how many rows they appeared in
    (a rough proxy for "how well-studied / how repeatedly confirmed"),
    with the parts they were found in, the highest recorded amount, and
    the distinct sources behind them
  - distinct ethnobotanical activities, ranked the same way, with the
    countries reporting them and distinct sources

Writes duke_summary.json (structured) and duke_summary.md (human-readable
tables, one section per plant) so you can actually scan it instead of
reading raw rows.

Usage:
    python summarize_duke_extract.py --in duke_extract.json --out-prefix duke_summary
"""

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path


def is_number(x):
    try:
        return x is not None and not (isinstance(x, float) and math.isnan(x)) and float(x) == float(x)
    except (TypeError, ValueError):
        return False


def to_float(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def summarize_plant(data):
    # --- Phytochemicals ---
    compounds = defaultdict(lambda: {"count": 0, "parts": set(), "max_ppm": None, "sources": set()})
    for row in data.get("phytochemicals_raw", []):
        c = compounds[row.get("compound", "UNKNOWN")]
        c["count"] += 1
        part = row.get("part")
        if part:
            c["parts"].add(str(part))
        hi = to_float(row.get("amount_high_ppm"))
        if hi is not None and is_number(hi):
            c["max_ppm"] = hi if c["max_ppm"] is None else max(c["max_ppm"], hi)
        ref = row.get("reference_full") or row.get("reference_code")
        if ref:
            c["sources"].add(str(ref))

    compound_list = [
        {
            "compound": name,
            "row_count": v["count"],
            "parts": sorted(v["parts"]),
            "max_ppm": v["max_ppm"],
            "source_count": len(v["sources"]),
            "sources": sorted(v["sources"])[:3],  # cap for readability
        }
        for name, v in compounds.items()
    ]
    compound_list.sort(key=lambda x: x["row_count"], reverse=True)

    # --- Ethnobotanical uses ---
    activities = defaultdict(lambda: {"count": 0, "countries": set(), "sources": set()})
    for row in data.get("ethnobotany_raw", []):
        a = activities[row.get("activity", "UNKNOWN")]
        a["count"] += 1
        country = row.get("country")
        if country:
            a["countries"].add(str(country))
        ref = row.get("reference_full") or row.get("reference_code")
        if ref:
            a["sources"].add(str(ref))

    activity_list = [
        {
            "activity": name,
            "row_count": v["count"],
            "countries": sorted(v["countries"]),
            "source_count": len(v["sources"]),
            "sources": sorted(v["sources"])[:3],
        }
        for name, v in activities.items()
    ]
    activity_list.sort(key=lambda x: x["row_count"], reverse=True)

    return compound_list, activity_list


def write_markdown(summary, out_path):
    lines = ["# Duke's data summary — ranked by row count\n"]
    for plant_id, data in summary.items():
        lines.append(f"## {plant_id} ({data['name_scientific']})\n")

        lines.append("### Top compounds\n")
        if data["compounds"]:
            lines.append("| Compound | Rows | Parts | Max PPM | # Sources |")
            lines.append("|---|---|---|---|---|")
            for c in data["compounds"][:20]:
                parts = ", ".join(c["parts"]) or "—"
                ppm = f"{c['max_ppm']:.0f}" if c["max_ppm"] is not None else "—"
                lines.append(f"| {c['compound']} | {c['row_count']} | {parts} | {ppm} | {c['source_count']} |")
        else:
            lines.append("_No compound data._")
        lines.append("")

        lines.append("### Top traditional uses\n")
        if data["activities"]:
            lines.append("| Activity | Rows | Countries | # Sources |")
            lines.append("|---|---|---|---|")
            for a in data["activities"][:20]:
                countries = ", ".join(a["countries"]) or "—"
                lines.append(f"| {a['activity']} | {a['row_count']} | {countries} | {a['source_count']} |")
        else:
            lines.append("_No ethnobotanical data._")
        lines.append("\n---\n")

    Path(out_path).write_text("\n".join(lines), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="infile", default="duke_extract.json")
    ap.add_argument("--out-prefix", default="duke_summary")
    args = ap.parse_args()

    raw = json.loads(Path(args.infile).read_text(encoding="utf-8"))

    summary = {}
    for plant_id, data in raw.items():
        compounds, activities = summarize_plant(data)
        summary[plant_id] = {
            "name_scientific": data.get("name_scientific", ""),
            "compounds": compounds,
            "activities": activities,
        }

    json_out = f"{args.out_prefix}.json"
    md_out = f"{args.out_prefix}.md"
    Path(json_out).write_text(json.dumps(summary, indent=2), encoding="utf-8")
    write_markdown(summary, md_out)

    print(f"Wrote {json_out} and {md_out}")
    for plant_id, data in summary.items():
        print(f"  {plant_id}: {len(data['compounds'])} distinct compounds, "
              f"{len(data['activities'])} distinct activities")


if __name__ == "__main__":
    main()
