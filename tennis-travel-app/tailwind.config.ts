import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a1628",
          800: "#1e3a5f",
          700: "#1e4976",
          600: "#1a6091",
        },
        gold: {
          300: "#f0d870",
          400: "#e8c84a",
          500: "#d4af37",
        },
        bronze: {
          600: "#b45309",
        },
        "live-red": "#ef4444",
        "xp-blue": "#3b82f6",
        "tier-silver": "#9ca3af",
        "tier-gold": "#d97706",
        "tier-diamond": "#7c3aed",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        elevated: "0 4px 16px rgba(0,0,0,0.12)",
        gold: "0 0 14px rgba(212,175,55,0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.3s ease-out",
        "count-up": "countUp 1.5s ease-out",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
