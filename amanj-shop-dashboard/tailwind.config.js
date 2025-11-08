/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // انیمیشن پالس طولانی‌تر برای لوگو
        "pulse-slow": {
          "0%, 100%": { opacity: ".4" },
          "50%": { opacity: ".8" },
        },
        // انیمیشن چرخش معکوس
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        // انیمیشن فیدین آهسته
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-reverse": "spin-reverse 1.5s linear infinite",
        "fade-in-slow": "fade-in-slow 2s ease-out",
      },
    },
  },
  plugins: [],
};
