import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Shared pieces for the link-preview images (app/opengraph-image.tsx and
 * app/plants/[id]/opengraph-image.tsx). The fonts in assets/og are static instances of the
 * self-hosted Unbounded and Plus Jakarta Sans files, because the image renderer can't read
 * variable woff2; they're under the same SIL Open Font License (see the OFL files there).
 */

export const ogSize = { width: 1200, height: 630 };

export const og = {
  cream: "#fff8ee",
  white: "#ffffff",
  green: "#0e5a38",
  ink: "#0b3d27",
  ink2: "#4c6457",
  pink: "#f7b3dc",
  yellow: "#f6c343",
  lavender: "#cdb9f3",
  orange: "#f39a3b",
  mint: "#bfe3c6",
  sand: "#f2e6d2",
};

/** Tag colour for a language, by the region it's mainly spoken in. */
export const regionColour: Record<string, string> = {
  "West Africa": og.pink,
  "Central Africa": og.mint,
  "East Africa": og.lavender,
  "Southern Africa": og.yellow,
  "North Africa": og.orange,
  Other: og.sand,
};

const font = (file: string) => readFile(join(process.cwd(), "assets/og", file));

export async function loadOgFonts() {
  const [unbounded, jakarta, jakartaBold, jakartaItalic] = await Promise.all([
    font("Unbounded-Medium.ttf"),
    font("PlusJakartaSans-Medium.ttf"),
    font("PlusJakartaSans-Bold.ttf"),
    font("PlusJakartaSans-MediumItalic.ttf"),
  ]);
  return [
    { name: "Unbounded", data: unbounded, weight: 500 as const, style: "normal" as const },
    { name: "Jakarta", data: jakarta, weight: 500 as const, style: "normal" as const },
    { name: "Jakarta", data: jakartaBold, weight: 700 as const, style: "normal" as const },
    { name: "Jakarta", data: jakartaItalic, weight: 500 as const, style: "italic" as const },
  ];
}

/** A file from /public as a data URI, or null if it can't be read. */
export async function publicImage(path?: string) {
  if (!path) return null;
  try {
    const data = await readFile(join(process.cwd(), "public", path));
    const type = path.endsWith(".png") ? "png" : "jpeg";
    return `data:image/${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/** True when the bundled Latin fonts can draw the text without fetching another font. */
export const isLatin = (text: string) => /^[\u0000-ɏḀ-ỿ\s.,'&()/-]+$/.test(text);

export function Leaf({ size, colour }: { size: number; colour: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: og.green, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>
      <Leaf size={28} colour={og.green} />
      PlantLens
    </div>
  );
}

/** A white chip with a coloured language tag, as on the site's local-names list. */
export function NameChip({ language, name, colour, size = 22 }: { language: string; name: string; colour: string; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: og.white, borderRadius: 14, padding: "8px 14px 8px 8px", boxShadow: "0 8px 20px rgba(11,61,39,0.12)" }}>
      <div style={{ display: "flex", background: colour, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 7px", borderRadius: 7, color: og.ink }}>
        {language}
      </div>
      <div style={{ display: "flex", fontFamily: "Unbounded", fontSize: size, letterSpacing: "-0.02em", color: og.ink }}>{name}</div>
    </div>
  );
}

/** A photo inside a white border on a coloured backing tile, the site's photo-card style. */
export function PhotoTile({ src, width, height, backing, rotate = 0, radius = 28 }: { src: string | null; width: number; height: number; backing: string; rotate?: number; radius?: number }) {
  return (
    <div style={{ display: "flex", position: "relative", width, height, transform: `rotate(${rotate}deg)` }}>
      <div style={{ display: "flex", position: "absolute", left: 14, top: 14, width, height, borderRadius: radius, background: backing }} />
      <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width, height, borderRadius: radius, overflow: "hidden", border: "6px solid #ffffff", background: og.mint, alignItems: "center", justifyContent: "center" }}>
        {src ? (
          // The image renderer needs a plain <img>; next/image doesn't apply here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" width={width - 12} height={height - 12} style={{ width: width - 12, height: height - 12, objectFit: "cover" }} />
        ) : (
          <Leaf size={Math.round(width / 3)} colour={og.green} />
        )}
      </div>
    </div>
  );
}
