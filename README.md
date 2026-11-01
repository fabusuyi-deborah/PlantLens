# PlantLens

**Live site: <https://plant-lens-beta.vercel.app>**

PlantLens is a search app for plants commonly found in Nigerian homes, gardens and markets. Search by the name you know, whether that's English, botanical, Yoruba, Igbo or Hausa. For each plant it shows its local names, traditional uses, phytochemicals and cautions, and every claim carries a source citation.

It is built on a hand-curated dataset of 20 plants, `plants.json`, served as static data with no backend. The Python scripts in this repo pull raw data from **Dr. Duke's Phytochemical and Ethnobotanical Databases** (USDA) to help curate that dataset, and fetch openly licensed plant photos from Wikimedia Commons and iNaturalist.

## How it was built

I'm Deborah Fabusuyi, a Plant Biology graduate (University of Ilorin) and frontend engineer. PlantLens is where those two meet.

- **Product and data: me.** I chose the plants, curated `plants.json` from Dr. Duke's, NMPPDB and published studies, checked local names against their sources, and decided how uses are worded. They're described as traditional uses with citations, never as medical claims. The [data pipeline](#data-pipeline) and [photo workflow](#plant-photos) below are the tools I use for that.
- **Design.** I directed the November 2026 redesign. I set the visual direction, reviewed each iteration on desktop and mobile, and made the calls on layout, accessibility and where disclaimers belong.
- **Code.** The redesign's implementation was AI-assisted, using Claude. It was shipped as page-by-page pull requests (#1, #3–#7) that I reviewed and merged, and the commits authored by "Claude" in the history come from that work. Earlier versions of the app, including its search, citation handling and data model, are in the history under my name.

## Running the app

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. Next.js 16 has breaking changes from earlier versions: check `node_modules/next/dist/docs/` before relying on older patterns.

### Pages

| Route | What it shows |
|---|---|
| `/` | Search-first intro, rotating featured plants, curated sections (richest in compounds, spices & drinks, leafy vegetables, medicinal fruit trees), category row and ticker |
| `/explore` | Search, category, sort and name language, all kept in the URL so results can be shared (`?q=`, `?category=`, `?sort=`, `?names=`, `?page=`) |
| `/plants/[id]` | A plant's profile: photo, "Say it in" local names, uses filterable by region, compound tiles, cautions by severity, and numbered sources with hover and click-to-reveal citations. Statically generated for every plant. |
| `/categories` | Every category with a description, plant count and a preview of its plants |
| `/sources` | The databases and literature behind the data, how it's curated, and photo credits (`/sources#photo-credits` opens them) |
| `/about` | Why PlantLens exists, the curator, what powers it, and the medical disclaimer |
| 404 | A broken-leaf "page not found", with a plant-specific message for unknown `/plants/...` links |

The header search (click it or press ⌘K / Ctrl K) works from any page and remembers recent searches.

### Design

- **Fonts:** Unbounded for headings and Plus Jakarta Sans for body text, self-hosted from `public/fonts` (SIL OFL). Both render Yoruba, Igbo and Hausa diacritics.
- **Tokens:** colours, radii, type scale and animations are defined as Tailwind theme tokens in `src/app/globals.css`.
- **Motion:** every carousel and ticker can be paused, and motion is reduced when the visitor's system asks for it.
- **Link previews:** each plant page shares its own photo when the link is posted on WhatsApp, X or LinkedIn.

## Project layout

| Path | What it is |
|---|---|
| `plants.json` | **The curated dataset.** Hand-edited: this is the file the app uses. |
| `src/app/` | Routes (see [Pages](#pages)), `globals.css` (design tokens, fonts) and `not-found.tsx`. |
| `src/components/` | UI components. `home/`, `explore/`, `plant-detail/` and `not-found/` hold page-specific pieces; `ui/` holds shared primitives (buttons, wave bands, section headings, the broken leaf). |
| `src/lib/plants.ts` | Loads `plants.json` and derives counts and stats. |
| `src/lib/plant-profile.ts` | Builds a plant page's data: numbered citations, regions for each use, cautions by severity, suggested plants. |
| `src/lib/search.ts` | Accent-insensitive search across common, scientific and local names and categories, plus "matched on" labels. |
| `src/lib/explore-url.ts` | Builds and validates `/explore` URLs (search, category, sort, names, page). |
| `src/lib/categories.ts` | Label, description and icon for each category. |
| `src/lib/citations.ts` | Collects a plant's citations and which databases it draws on. |
| `src/lib/site.ts` | Site URL, repo link, curator links and the corrections form URL. |
| `src/types/plant.ts` | TypeScript types for the dataset. |
| `public/fonts/` | Self-hosted Unbounded and Plus Jakarta Sans, with their licences. |
| `extract_duke_data.py` | Data step 1: pulls every raw Duke's row (chemicals + traditional uses) for each plant in `plants.json`. |
| `summarize_duke_extract.py` | Data step 2: collapses the raw rows into ranked, readable summaries. |
| `duke_extract.json` | Generated by step 1. Raw rows per plant. |
| `duke_summary.json` / `duke_summary.md` | Generated by step 2. Top compounds and uses per plant, ranked. |
| `Duke-Source-CSV/` | The unzipped Duke's CSV export (input data, about 40 MB, not committed). |
| `fetch_plant_photos.py` | Finds openly licensed photos for each plant and applies the ones you pick. See [Plant photos](#plant-photos). |
| `public/plants/` | The plant photos, one per plant. |
| `photo_candidates.json` / `photo_review.html` | Working files from the photo script (not committed). |

## The plants

scent leaf, bitter leaf, moringa, neem, bitter kola, kola nut, uziza, aloe vera, roselle (zobo), pawpaw, guava, mango, lemongrass, soursop, garden egg, cashew, ugwu, bitter melon, turmeric and ginger.

## `plants.json` schema

Each item in the array looks like this. Fields marked *optional* can be left out; the app shows them once they're curated.

```jsonc
{
  "id": "scent-leaf",                         // kebab-case, unique; used in the URL
  "name_common": "Scent leaf",
  "name_scientific": "Ocimum gratissimum",    // Genus species: used to match Duke's data
  "names_local": {
    "yoruba": "Efinrin", "igbo": "Nchanwu", "hausa": "Daidoya",
    "other": [{ "label": "Edo", "name": "…" }] // optional: other languages or regions
  },
  "category": ["medicinal", "culinary"],      // one or more of: medicinal, culinary, spice, beverage,
                                              //   leafy_vegetable, vegetable, stimulant
  "description": "Plain-language overview…",
  "family": "Lamiaceae",                      // optional
  "parts_used": ["Leaves"],                   // optional
  "traditional_uses": [
    {
      "title": "Cold & Catarrh",              // optional short heading
      "use": "Used in Nigeria to treat catarrh.",
      "source_citation": "Ayensu (1978)… via Duke's"
    }
  ],
  "cautions": [
    {
      "title": "Pregnancy",                   // optional
      "severity": "moderate",                 // optional: high | moderate | low
      "note": "Excessive use may cause…",
      "source_citation": "Farombi & Owoeye (2011), via NMPPDB"
    }
  ],
  "phytochemicals": [                         // optional: not yet curated for every plant
    {
      "compound": "Eugenol",
      "class": "Phenylpropanoid",             // optional
      "associated_properties": "Plain-language description of what it's associated with.",
      "source_citation": "USDA Dr. Duke's Phytochemical and Ethnobotanical Database…"
    }
  ],
  "photo_url": "/plants/scent-leaf-5ed92197.jpg", // under public/; empty shows a leaf placeholder
  "photo_credit": {                           // optional: required for CC BY / CC BY-SA photos
    "author": "Forest & Kim Starr",
    "license": "CC BY 3.0",
    "source_url": "https://commons.wikimedia.org/wiki/File:Starr_030202-0053_Ocimum_gratissimum.jpg"
  }
}
```

The types live in [`src/types/plant.ts`](src/types/plant.ts). A new category also needs an entry in [`src/lib/categories.ts`](src/lib/categories.ts).

**Rule:** every `traditional_uses`, `cautions` and `phytochemicals` entry must have a `source_citation`. Keep wording descriptive ("traditionally used for…", "associated with…"), not medical claims. The app groups citations by source: include "NMPPDB" or "Duke" in the citation text when the data came from those databases.

## Data pipeline

How `plants.json` is built.

```
Duke-Source-CSV/*.csv ─┐
                       ├─► extract_duke_data.py ─► duke_extract.json ─► summarize_duke_extract.py ─► duke_summary.{json,md}
plants.json ───────────┘                                                                                  │
      ▲                                                                                                   │
      └──────────────────────────── manual curation (you) ◄───────────────────────────────────────────────┘
```

### 1. Get the source data

Download the Duke's CSV export (<https://ndownloader.figshare.com/files/43363335>) and unzip it into `Duke-Source-CSV/`. The scripts need `FNFTAX.csv`, `FARMACY_NEW.csv`, `ETHNOBOT.csv`, `PARTS.csv` and `REFERENCES.csv`.

### 2. Install dependencies

Requires Python 3.8+ and pandas:

```bash
pip install pandas
```

### 3. Extract raw data

```bash
python extract_duke_data.py --duke-dir ./Duke-Source-CSV --plants plants.json
```

- Matches each plant to Duke's by **genus + species**, taken from `name_scientific` (case-insensitive).
- Expands plant-part codes and reference codes into readable text. A citation that can't be resolved shows up as `[unresolved reference code: XYZ]` so it doesn't disappear silently.
- Writes `duke_extract.json` (`--out` to change). The script prints the row counts for each plant and lists any plants with **no match**. For those, check spelling or try a botanical synonym.

### 4. Summarize

```bash
python summarize_duke_extract.py --in duke_extract.json --out-prefix duke_summary
```

For each plant, this ranks distinct compounds and traditional uses by how many rows they appear in, which is a rough proxy for how well studied they are. It records parts, max PPM, countries and distinct sources. Open `duke_summary.md` to scan the top 20 of each.

### 5. Curate into `plants.json`

This step is manual, and it's the part the scripts can't do for you:

1. Pick the compounds and uses from `duke_summary.md` that are worth including.
2. Write a plain-language `associated_properties` or `use` for each.
3. Confirm the citation (use the full reference from `duke_extract.json`).
4. Add cautions from other sources (for example NMPPDB) where relevant.

Plants Duke's doesn't cover (garden egg and ugwu) or covers thinly are curated from NMPPDB and published studies instead.

## Plant photos

`fetch_plant_photos.py` finds openly licensed photos (CC0, public domain, CC BY, CC BY-SA) for each plant by `name_scientific`, searching the Wikimedia Commons species category, a Commons keyword search and iNaturalist research-grade observations. It needs only the Python standard library.

```bash
python fetch_plant_photos.py candidates
# open photo_review.html, then set "pick": <number> per plant in photo_candidates.json
python fetch_plant_photos.py apply
```

- Picking is manual on purpose: the first result is often a herbarium sheet, a seed close-up or a mislabelled upload.
- `apply` downloads each pick to `public/plants/<id>-<hash>.jpg` and sets `photo_url` and `photo_credit` in `plants.json`. Plants with `"pick": null` are skipped.
- The hash in the filename changes whenever the photo does, because Next.js caches optimized images by URL.
- No good option for some plants? `python fetch_plant_photos.py candidates --unpicked-only --per-source 10` searches again for just those, skipping photos you've already seen.
- If a photo has no author on record, `apply` warns you to fill in `photo_credit.author` by hand.

Credits show under the photo on each plant page and in the Photo credits section of `/sources`.

## Status

| | Count |
|---|---|
| Plants | 20 |
| With traditional uses | 20 |
| With phytochemicals curated | 20 |
| With cautions | 18 |
| With family / parts used | 0 |
| With photos | 20 |

Still to do:

- Verify the remaining flagged local names against NMPPDB.
- Wire up the corrections form (`site.correctionsFormUrl`) so visitors can report a wrong name.
- Cautions for scent leaf and garden egg.
- `family` and `parts_used` for every plant.
- Fix the stray `�` characters left in a few citations by the `latin-1` read of Duke's CSVs.

## Notes and gotchas

- Duke's CSVs aren't consistently encoded. The extractor reads them as `latin-1`.
- Blank amounts show up as `NaN` in `duke_extract.json`. That's expected: it's valid for Python's `json` module, but some strict JSON parsers reject it.
- `EO` in the compound lists means *essential oil* (total), not a single compound.
- Re-running the Duke's scripts overwrites the generated files but never touches `plants.json`. `fetch_plant_photos.py apply` writes only `photo_url` and `photo_credit`.

## Data sources

Dr. Duke's data is public domain (CC0). Plant photos come from Wikimedia Commons and iNaturalist under CC0, CC BY or CC BY-SA; each one's author and license are in its `photo_credit`.

- USDA ARS, *Dr. Duke's Phytochemical and Ethnobotanical Databases*: <https://phytochem.nal.usda.gov>
- NMPPDB, *Nigerian Medicinal Plants and Phytochemicals Database*: <https://nmppdb.com.ng>. NMPPDB asks to be cited when its data is used.

PlantLens is for information only and isn't medical advice.
