import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js App Router pages, layouts, etc.
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // For components, context, hooks moved into src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;