import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#eef1f8", 100: "#d9e0f0", 600: "#1e3a8a", 700: "#172e6e", 800: "#10224f", 900: "#0b1738" },
        royal: { 50: "#f5f0ff", 100: "#e9dcff", 500: "#7c3aed", 600: "#6d28d9" },
        surface: "#f4f6fb",
      },
      fontFamily: { sans: ["var(--font-poppins)", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 1px 2px rgba(16,34,79,.06), 0 4px 16px rgba(16,34,79,.06)" },
    },
  },
  plugins: [],
};
export default config;
