import React from "react";
import { pokemonTypeColors, itemTypeColors } from "@/lib/colors";

// This component ensures Tailwind emits CSS vars for all tokens we use dynamically
// by referencing each token at least once via a literal class.
export default function ColorsTokenRegistry() {
  const tokens = Array.from(
    new Set([
      ...Object.values(pokemonTypeColors),
      ...Object.values(itemTypeColors),
    ])
  );

  // Reference tokens across multiple utilities to ensure Tailwind emits them in all contexts
  const classes = tokens
    .flatMap((t) => [
      `text-${t}`,
      `bg-${t}`,
      `border-t-${t}`,
    ])
    .join(" ");

  return <div className={`hidden ${classes}`} aria-hidden />;
}

