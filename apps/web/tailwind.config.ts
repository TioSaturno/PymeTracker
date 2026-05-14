import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../shared/components/**/*.{js,ts,jsx,tsx,mdx}", // Mantén esto que es de tu rama
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        background: "#fbf8ff",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;