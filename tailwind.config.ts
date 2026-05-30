import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FFF9F5",
          sidebar: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#F4EDE6",
        },
        text: {
          primary: "#3D2E26",
          secondary: "#7A6B62",
        },
        border: {
          DEFAULT: "#DDD0C5",
        },
        brand: {
          50: "#FDF5EF",
          100: "#FAE8DB",
          200: "#F4D0B5",
          300: "#E8AD82",
          400: "#D9824A",
          500: "#B35A1F",
          600: "#9A4C18",
          700: "#7D3E14",
          800: "#5C2E10",
          900: "#3D2E26",
          950: "#261C16",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        input: "12px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [
    heroui({
      layout: {
        radius: {
          small: "8px",
          medium: "12px",
          large: "16px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#FFF9F5",
            foreground: "#3D2E26",
            content1: "#FFFFFF",
            content2: "#FFF9F5",
            content3: "#F4EDE6",
            content4: "#EBE2DA",
            divider: "#DDD0C5",
            focus: "#B35A1F",
            default: {
              50: "#FAF7F5",
              100: "#F4EEE9",
              200: "#EDE4DC",
              300: "#DDD0C5",
              400: "#A89890",
              500: "#7A6B62",
              600: "#5C4F48",
              700: "#4A3F38",
              800: "#3D2E26",
              900: "#2A1F19",
              DEFAULT: "#DDD0C5",
              foreground: "#3D2E26",
            },
            primary: {
              50: "#FDF5EF",
              100: "#FAE8DB",
              200: "#F4D0B5",
              300: "#E8AD82",
              400: "#D9824A",
              500: "#B35A1F",
              600: "#9A4C18",
              700: "#7D3E14",
              800: "#5C2E10",
              900: "#3D2E26",
              DEFAULT: "#B35A1F",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FF9800",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: "#1A1410",
            foreground: "#F4EEE9",
            content1: "#261C16",
            content2: "#2A1F19",
            content3: "#3D2E26",
            content4: "#4A3F38",
            divider: "#5C4F48",
            focus: "#D9824A",
            default: {
              50: "#1A1410",
              100: "#261C16",
              200: "#2A1F19",
              300: "#3D2E26",
              400: "#5C4F48",
              500: "#7A6B62",
              600: "#A89890",
              700: "#DDD0C5",
              800: "#F0E8E2",
              900: "#FAF7F5",
              DEFAULT: "#5C4F48",
              foreground: "#F4EEE9",
            },
            primary: {
              DEFAULT: "#D9824A",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FF9800",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};

export default config;
