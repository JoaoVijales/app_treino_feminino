import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'coral-vital': '#FF6B6B',
        'coral-suave': '#FFB4B4',
        'lavanda-profunda': '#8B7FC7',
        'lavanda-clara': '#C4B5E8',
        'areia': '#F8F6F3',
        'grafite-suave': '#4A4A4A',
        'cinza-claro': '#E0E0E0',
        'verde-energia': '#6BCF7F',
        'amarelo-suave': '#FFD93D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
} satisfies Config;
