import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F7F3EC",
        bedrock: "#1C1712",
        loam: {
          DEFAULT: "#5B3A29",
          light: "#7A5540",
          dark: "#3E2A1E",
        },
        chlorophyll: {
          DEFAULT: "#7A9B6E",
          // Darker variant for text on light backgrounds -- the DEFAULT
          // shade is 2.82:1 on parchment (fails WCAG AA for text); this is
          // 6.34:1. Use DEFAULT for fills/icons/badges-with-dark-text,
          // use `text` for actual small readable text on a light background.
          text: "#356339",
        },
        clay: "#C97A3C",
        oxide: "#B04A3F",
        horizon: {
          top: "#8A6A4B",   // topsoil
          sub: "#5B3A29",   // subsoil
          base: "#3E2A1E",  // substratum
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sh: "10px",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(28, 23, 18, 0.08)",
      },
      keyframes: {
        "horizon-fill": {
          from: { width: "0%" },
          to: { width: "var(--fill-to, 100%)" },
        },
      },
      animation: {
        "horizon-fill": "horizon-fill 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
