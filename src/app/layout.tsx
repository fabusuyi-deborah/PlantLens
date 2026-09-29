import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Disclaimer } from "@/components/disclaimer";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlantLens",
  description:
    "Nigerian household plants: local names, traditional uses and phytochemicals, with sources.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Disclaimer />
        <Footer />
      </body>
    </html>
  );
}
