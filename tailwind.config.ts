import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        cjk: ["var(--font-noto-sc)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          gold: "#D6B35A",
          "gold-dim": "#B8943A",
          "gold-hover": "#E0BF6A",
        },
        signal: {
          up: "#34D399",
          "up-bg": "rgba(52,211,153,.12)",
          down: "#F87171",
          "down-bg": "rgba(248,113,113,.12)",
        },
        surface: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
          2: "var(--bg-2)",
          3: "var(--bg-3)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-h)",
        },
        content: {
          0: "var(--text-0)",
          1: "var(--text-1)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        xs: "6px",
      },
      boxShadow: {
        card: "var(--card-shadow)",
        "card-hover": "var(--card-shadow-h)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "flash-up": {
          "0%": { backgroundColor: "rgba(52,211,153,0.15)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-down": {
          "0%": { backgroundColor: "rgba(248,113,113,0.15)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease infinite",
        shimmer: "shimmer 1.5s infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(.4,0,.2,1) both",
        "fade-in": "fade-in 0.2s ease both",
        "flash-up": "flash-up 1s ease-out",
        "flash-down": "flash-down 1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
