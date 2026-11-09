import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ground: "#f6f5f1",
        line: {
          DEFAULT: "#e2dfd8",
          strong: "#b9b4a9",
        },
        ink: {
          DEFAULT: "#1c1b19",
          muted: "#6b675f",
        },
        placeholder: "#9a958b",
        accent: {
          DEFAULT: "#1c1b19",
          hover: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(28, 27, 25, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
