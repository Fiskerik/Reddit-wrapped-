/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        brand: "#ff4500",
        "brand-soft": "#ff6b5a",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,69,0,0.25)",
      },
    },
  },
  plugins: [],
};
