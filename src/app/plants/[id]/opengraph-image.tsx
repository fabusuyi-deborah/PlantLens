import { ImageResponse } from "next/og";
import { Leaf, Logo, NameChip, PhotoTile, isLatin, loadOgFonts, og, ogSize, publicImage, regionColour } from "@/app/_og/shared";
import { categoryMeta } from "@/lib/categories";
import { groupByRegion } from "@/lib/languages";
import { firstName, plural } from "@/lib/plant-text";
import { getAllPlants, getPlantById } from "@/lib/plants";
import { formatRegions } from "@/lib/regions";
import { site } from "@/lib/site";

/*
 * Link-preview card for each plant page, matching the page's hero: photo, where the plant is
 * found and its local names across African languages. Rendered at build time for every plant.
 */

export const alt = "PlantLens plant profile: photo, where it grows and its local names";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPlants().map((plant) => ({ id: plant.id }));
}

const backings = [og.pink, og.yellow, og.lavender, og.orange, og.mint];
const MAX_CHIPS = 4;

/** Shrinks the plant name so long names still fit the left column. */
function nameSize(name: string) {
  if (name.length <= 10) return 80;
  if (name.length <= 14) return 66;
  if (name.length <= 20) return 54;
  return 44;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = getPlantById(id);
  const fonts = await loadOgFonts();

  if (!plant) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, background: og.cream, color: og.green, fontFamily: "Unbounded", fontSize: 72 }}>
          <Leaf size={72} colour={og.green} />
          PlantLens
        </div>
      ),
      { ...size, fonts },
    );
  }

  const groups = groupByRegion(plant.names_local);
  // Take names region by region in turn, so a plant known across Africa shows that range.
  const picked: { language: string; name: string; colour: string }[] = [];
  for (let round = 0; picked.length < MAX_CHIPS; round++) {
    const before = picked.length;
    for (const group of groups) {
      const entry = group.entries[round];
      if (entry && picked.length < MAX_CHIPS && isLatin(entry.name)) {
        picked.push({ language: entry.language, name: firstName(entry.name), colour: regionColour[group.region] ?? og.sand });
      }
    }
    if (picked.length === before) break;
  }
  const more = plant.names_local.length - picked.length;
  const knownIn = `Known in ${plural(plant.names_local.length, "language")}${groups.length > 1 ? ` across ${plural(groups.length, "region")}` : ""}`;
  const foundIn = formatRegions(plant.regions ?? []);

  const photo = await publicImage(plant.photo_url);
  const index = getAllPlants().findIndex((p) => p.id === plant.id);
  const backing = backings[Math.max(index, 0) % backings.length];
  const credit = plant.photo_credit;
  const creditText = credit
    ? isLatin(credit.author)
      ? `Photo: ${credit.author} · ${credit.license}`
      : `Photo: ${credit.license} · credited on PlantLens`
    : "";
  const urlHost = site.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: og.cream, fontFamily: "Jakarta", color: og.ink, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 64, top: 52, width: 610, bottom: 40 }}>
          <Logo />

          <div style={{ display: "flex", gap: 8, marginTop: 30 }}>
            {plant.category.slice(0, 2).map((cat) => (
              <div key={cat} style={{ display: "flex", background: og.pink, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 11px", borderRadius: 8 }}>
                {categoryMeta[cat]?.label ?? cat}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 12, fontFamily: "Unbounded", fontSize: nameSize(plant.name_common), lineHeight: 1.04, letterSpacing: "-0.035em", color: og.green }}>
            {plant.name_common}
          </div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 25, fontStyle: "italic", color: og.ink2 }}>{plant.name_scientific}</div>

          {foundIn && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, fontSize: 19, fontWeight: 700, color: og.ink }}>
              <div style={{ display: "flex", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: og.ink2 }}>Found in</div>
              {foundIn}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
            {picked.map((entry) => (
              <NameChip key={entry.language} language={entry.language} name={entry.name} colour={entry.colour} size={21} />
            ))}
            {more > 0 && (
              <div style={{ display: "flex", alignItems: "center", background: og.green, color: og.cream, borderRadius: 14, padding: "0 16px", fontSize: 17, fontWeight: 700 }}>
                +{more} more
              </div>
            )}
          </div>

          <div style={{ display: "flex", marginTop: "auto", fontSize: 18, fontWeight: 500, color: og.ink2 }}>{knownIn}</div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 17, fontWeight: 700, color: og.green }}>
            {urlHost}/plants/{plant.id}
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", left: 730, top: 64 }}>
          <PhotoTile src={photo} width={400} height={450} backing={backing} rotate={-3} />
        </div>
        {creditText && (
          <div style={{ display: "flex", position: "absolute", left: 738, top: 552, width: 410, fontSize: 14, color: og.ink2 }}>{creditText}</div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
