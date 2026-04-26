import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        loop: {
          blue: {
            50:  "#EFF4FB",
            100: "#DCE7F7",
            200: "#B8CFEF",
            300: "#8AAFE2",
            400: "#5A8DD3",
            500: "#2E6BCF",
            600: "#1E5BB8",
            700: "#163F82",
            800: "#0F2D5E",
            900: "#0B1F3D",
          },
          green: {
            50:  "#EEF7EF",
            100: "#D9EDDC",
            200: "#B5DCBC",
            300: "#88C893",
            400: "#5BB46A",
            500: "#4DB85B",
            600: "#3FAE4F",
            700: "#2E8A3D",
            800: "#216A2D",
            900: "#16461E",
          },
          ink:    "#0B1F3D",
          body:   "#334155",
          muted:  "#64748B",
          surface: "#F8FAFC",
          "surface-soft":   "#F1F5F9",
          "surface-tinted": "#F0F7F1",
          border: "#E5EAF1",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(15, 23, 42, 0.05)",
        card: "0 2px 8px rgba(15, 23, 42, 0.04)",
        glow: "0 8px 24px rgba(30, 91, 184, 0.18)",
        "glow-green": "0 8px 24px rgba(63, 174, 79, 0.18)",
      },
      backgroundImage: {
        "loop-gradient":
          "linear-gradient(135deg, #1E5BB8 0%, #2E6BCF 35%, #4DB85B 70%, #3FAE4F 100%)",
        "loop-gradient-soft":
          "linear-gradient(135deg, #EFF4FB 0%, #EEF7EF 100%)",
        "loop-blue-gradient":
          "linear-gradient(135deg, #1E5BB8 0%, #2E6BCF 100%)",
        "loop-green-gradient":
          "linear-gradient(135deg, #2E8A3D 0%, #3FAE4F 100%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in":  "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "count-up": "count-up 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
