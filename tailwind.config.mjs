/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        body: "var(--body-text-size)",
        h2: "var(--h2-text-size)",
        h3: "var(--h3-text-size)",
        custom: "var(--custom-text-size)",
      }
    },
  },
  plugins: [],
};
