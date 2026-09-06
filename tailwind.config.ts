import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        dark: "#0F172A",
        light: "#F8FAFC",
      },
      fontFamily: { sans: ["Tajawal", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
