import defaultTheme from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "erp-blue-1": "hsl(var(--erp-blue-1))",
        "erp-blue-2": "hsl(var(--erp-blue-2))",
        "erp-blue-3": "hsl(var(--erp-blue-3))",
        "erp-blue-4": "hsl(var(--erp-blue-4))",
        "erp-blue-5": "hsl(var(--erp-blue-5))",
        "erp-blue-6": "hsl(var(--erp-blue-6))",
        "erp-blue-7": "hsl(var(--erp-blue-7))",
        "erp-blue-8": "hsl(var(--erp-blue-8))",
        "erp-blue-9": "hsl(var(--erp-blue-9))",
        "erp-blue-10": "hsl(var(--erp-blue-10))",
        "erp-blue-11": "hsl(var(--erp-blue-11))",
        "erp-blue-12": "hsl(var(--erp-blue-12))",
        "erp-blue-13": "hsl(var(--erp-blue-13))",
        "erp-blue-14": "hsl(var(--erp-blue-14))",
        "erp-blue-15": "hsl(var(--erp-blue-15))",
        "erp-blue-16": "hsl(var(--erp-blue-16))",
        "erp-blue-17": "hsl(var(--erp-blue-17))",
        "erp-blue-18": "hsl(var(--erp-blue-18))",
        "erp-gray-1": "hsl(var(--erp-gray-1))",
        "erp-gray-2": "hsl(var(--erp-gray-2))",
        "erp-gray-3": "hsl(var(--erp-gray-3))",
        "erp-gray-4": "hsl(var(--erp-gray-4))",
        "erp-gray-5": "hsl(var(--erp-gray-5))",
        "erp-gray-6": "hsl(var(--erp-gray-6))",
        "erp-gray-7": "hsl(var(--erp-gray-7))",
        "erp-gray-8": "hsl(var(--erp-gray-8))",
        "erp-gray-9": "hsl(var(--erp-gray-9))",
        "erp-green-1": "hsl(var(--erp-green-1))",
        "erp-green-2": "hsl(var(--erp-green-2))",
        "erp-yellow-1": "hsl(var(--erp-yellow-1))",
        "erp-yellow-2": "hsl(var(--erp-yellow-2))",
        "erp-yellow-3": "hsl(var(--erp-yellow-3))",
        "erp-orange-1": "hsl(var(--erp-orange-1))",
        "erp-red-1": "hsl(var(--erp-red-1))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        scrollbar: "hsl(var(--scrollbar))",
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      spacing: {
        4.5: "1.125rem", // 18px
        5.5: "1.375rem", // 22px
        6.5: "1.625rem", // 26px
        7.5: "1.875rem", // 30px
        8.5: "2.125rem", // 34px
        9.5: "2.375rem", // 38px
        10.5: "2.625rem", // 42px
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries"), require("tailwindcss-animate")],
};

export default config;
