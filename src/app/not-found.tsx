import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found/not-found-view";

export const metadata: Metadata = { title: "Page not found · PlantLens" };

export default function NotFound() {
  return (
    <NotFoundView
      title="This page has wilted."
      body="The page you're looking for doesn't exist or has moved."
    />
  );
}
