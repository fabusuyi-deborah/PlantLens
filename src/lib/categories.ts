import {
  ChefHat,
  Coffee,
  CupSoda,
  Flame,
  HeartPulse,
  Salad,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { PlantCategory } from "@/types/plant";

interface CategoryMeta {
  label: string;
  /** Plural label used on category cards. */
  pluralLabel: string;
  /** One-line summary shown on the categories page. */
  description: string;
  icon: LucideIcon;
  /** Text colour, used by pills and icon tiles. */
  text: string;
  /** Tinted background, used by pills and icon tiles. */
  bg: string;
  /** Pill colours, when they differ from the icon tile (per the design system). */
  pill?: string;
}

export const categoryMeta: Record<PlantCategory, CategoryMeta> = {
  medicinal: {
    label: "Medicinal",
    pluralLabel: "Medicinal",
    description: "Plants used in traditional remedies, with each use traced to a published source.",
    icon: HeartPulse,
    text: "text-danger",
    bg: "bg-danger-light",
    pill: "bg-accent-light text-accent-dark",
  },
  leafy_vegetable: {
    label: "Leafy Vegetable",
    pluralLabel: "Leafy Vegetables",
    description: "Leaves cooked into soups and stews, and valued for their nutrients.",
    icon: Salad,
    text: "text-accent",
    bg: "bg-accent-light",
  },
  vegetable: {
    label: "Vegetable",
    pluralLabel: "Vegetables",
    description: "Fruits eaten as vegetables, raw or cooked.",
    icon: Sprout,
    text: "text-accent",
    bg: "bg-accent-light",
  },
  culinary: {
    label: "Culinary Herb",
    pluralLabel: "Culinary Herbs",
    description: "Aromatic herbs used to season soups, stews and sauces.",
    icon: ChefHat,
    text: "text-warm",
    bg: "bg-warm-light",
  },
  spice: {
    label: "Spice",
    pluralLabel: "Spices",
    description: "Seeds, roots and rhizomes that add heat and depth to Nigerian cooking.",
    icon: Flame,
    text: "text-accent-secondary",
    bg: "bg-accent-secondary-light",
  },
  beverage: {
    label: "Beverage",
    pluralLabel: "Beverages",
    description: "Plants brewed, steeped or pressed into drinks, from zobo to lemongrass tea.",
    icon: CupSoda,
    text: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  stimulant: {
    label: "Stimulant",
    pluralLabel: "Stimulants",
    description: "Nuts chewed for their caffeine and bitter compounds, often shared at gatherings.",
    icon: Coffee,
    text: "text-warm",
    bg: "bg-warm-light",
  },
};
