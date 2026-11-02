import { ImageResponse } from "next/og";
import { Logo, NameChip, PhotoTile, isLatin, loadOgFonts, og, ogSize, publicImage, regionColour } from "@/app/_og/shared";
import { languageRegion } from "@/lib/languages";
import { firstName } from "@/lib/plant-text";
import { getDatasetStats, getPlantById } from "@/lib/plants";
import { site } from "@/lib/site";

/*
 * Site-wide link-preview card. The counts come from plants.json at build time, so they stay
 * right as plants and languages are added.
 */

export const alt = "PlantLens: Discover Africa's plants, by every name";
export const size = ogSize;
export const contentType = "image/png";

/** Bitter leaf's names in three languages, spread across regions where the data allows. */
function featuredNames() {
  const plant = getPlantById("bitter-leaf");
  if (!plant) return [];
  const wanted = ["Yoruba", "Swahili", "Igbo", "Hausa", "Akan (Twi)"];
  return wanted
    .map((language) => plant.names_local.find((entry) => entry.language === language))
    .filter((entry): entry is NonNullable<typeof entry> => !!entry && isLatin(entry.name))
    .slice(0, 3)
    .map((entry) => ({ language: entry.language, name: firstName(entry.name), colour: regionColour[languageRegion(entry.language)] ?? og.sand }));
}

export default async function Image() {
  const fonts = await loadOgFonts();
  const stats = getDatasetStats();
  const names = featuredNames();
  const [main, topRight, bottomRight] = await Promise.all([
    publicImage(getPlantById("bitter-leaf")?.photo_url),
    publicImage(getPlantById("moringa")?.photo_url),
    publicImage(getPlantById("scent-leaf")?.photo_url),
  ]);
  const tiles = [
    { value: stats.plants, label: "Plants", bg: og.lavender },
    { value: stats.languages, label: "Languages", bg: og.pink },
    { value: stats.citations, label: "Citations", bg: og.yellow },
  ];
  const chipSpots = [
    { left: 688, top: 190, rotate: -2 },
    { left: 900, top: 300, rotate: 2 },
    { left: 712, top: 410, rotate: -1.5 },
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: og.cream, fontFamily: "Jakarta", color: og.ink, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 64, top: 56, width: 600, bottom: 40 }}>
          <Logo />
          <div style={{ display: "flex", marginTop: 40, fontFamily: "Unbounded", fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.035em", color: og.green }}>
            Discover Africa&apos;s plants, by every name.
          </div>
          <div style={{ display: "flex", marginTop: 26, width: 580, fontSize: 21, lineHeight: 1.45, color: og.ink2 }}>
            Local names, traditional uses and phytochemicals for African plants, starting with Nigeria. Every claim cited.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: "auto", marginBottom: 26 }}>
            {tiles.map((tile) => (
              <div key={tile.label} style={{ display: "flex", flexDirection: "column", gap: 5, background: tile.bg, borderRadius: 14, padding: "12px 16px 11px", minWidth: 112 }}>
                <div style={{ display: "flex", fontFamily: "Unbounded", fontSize: 30, letterSpacing: "-0.03em" }}>{tile.value}</div>
                <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{tile.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: og.green }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>

        <div style={{ display: "flex", position: "absolute", left: 948, top: 44 }}>
          <PhotoTile src={topRight} width={176} height={150} backing={og.yellow} rotate={5} radius={24} />
        </div>
        <div style={{ display: "flex", position: "absolute", left: 740, top: 112 }}>
          <PhotoTile src={main} width={330} height={390} backing={og.pink} rotate={-3} />
        </div>
        <div style={{ display: "flex", position: "absolute", left: 1046, top: 400 }}>
          <PhotoTile src={bottomRight} width={124} height={124} backing={og.lavender} rotate={7} radius={24} />
        </div>
        {names.map((entry, i) => (
          <div key={entry.language} style={{ display: "flex", position: "absolute", left: chipSpots[i].left, top: chipSpots[i].top, transform: `rotate(${chipSpots[i].rotate}deg)` }}>
            <NameChip language={entry.language} name={entry.name} colour={entry.colour} size={24} />
          </div>
        ))}
        <div style={{ display: "flex", position: "absolute", left: 770, top: 540, fontSize: 17, color: og.ink2 }}>
          <span style={{ fontWeight: 700, color: og.ink, marginRight: 6 }}>Bitter leaf</span>
          <span style={{ fontStyle: "italic" }}>· Vernonia amygdalina</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
