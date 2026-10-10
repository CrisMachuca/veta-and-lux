import { Nixie_One, Urbanist } from "next/font/google";

// Fuentes de la web (las usan el layout de idioma y la 404 global)
const nixieOne = Nixie_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nixie-one",
  display: "swap",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-urbanist-sans",
  display: "swap",
});

export const CLASES_FUENTES = `${nixieOne.variable} ${urbanist.variable}`;
