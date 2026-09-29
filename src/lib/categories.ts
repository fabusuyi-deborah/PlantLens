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
  icon: LucideIcon;
  /** Text colour, used by pills and icon tiles. */
  text: string;
  /** Tinted background, used by pills and icon tiles. */
  bg: string;
}

export const categoryMeta: Record<PlantCategory, CategoryMeta> = {
  medicinal: {
    label: "Medicinal",
    pluralLabel: "Medicinal",
    icon: HeartPulse,
    text: "text-danger",
    bg: "bg-danger-light",
  },
  leafy_vegetable: {
    label: "Leafy Vegetable",
    pluralLabel: "Leafy Vegetables",
    icon: Salad,
    text: "text-accent",
    bg: "bg-accent-light",
  },
  vegetable: {
    label: "Vegetable",
    pluralLabel: "Vegetables",
    icon: Sprout,
    text: "text-accent",
    bg: "bg-accent-light",
  },
  culinary: {
    label: "Culinary Herb",
    pluralLabel: "Culinary Herbs",
    icon: ChefHat,
    text: "text-warm",
    bg: "bg-warm-light",
  },
  spice: {
    label: "Spice",
    pluralLabel: "Spices",
    icon: Flame,
    text: "text-accent-secondary",
    bg: "bg-accent-secondary-light",
  },
  beverage: {
    label: "Beverage",
    pluralLabel: "Beverages",
    icon: CupSoda,
    text: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  stimulant: {
    label: "Stimulant",
    pluralLabel: "Stimulants",
    icon: Coffee,
    text: "text-warm",
    bg: "bg-warm-light",
  },
};
