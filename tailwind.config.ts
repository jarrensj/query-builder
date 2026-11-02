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
        ground: "#f4f3ef",
        "surface-muted": "#fafaf7",
        line: {
          DEFAULT: "#e2dfd8",
          soft: "#eeebe4",
          strong: "#d6d2c9",
        },
        track: {
          DEFAULT: "#e8e5dd",
          line: "#dcd8ce",
        },
        ink: {
          DEFAULT: "#1c1b19",
          secondary: "#3f3c36",
          muted: "#6b675f",
        },
        placeholder: "#9a958b",
        accent: {
          DEFAULT: "#2b63d9",
          hover: "#2453b8",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(43, 99, 217, 0.15)",
        "tab-active": "0 0 0 1px #d6d2c9",
      },
    },
  },
  plugins: [],
};
export default config;
