import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";

const description =
  "African plants, starting with Nigeria: local names, traditional uses and phytochemicals, with sources.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "PlantLens",
  description,
  // Link previews (WhatsApp, X, LinkedIn…). The images come from opengraph-image.tsx files.
  openGraph: {
    siteName: "PlantLens",
    type: "website",
    title: "PlantLens · Discover Africa's plants, by every name",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
