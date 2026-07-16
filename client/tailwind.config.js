/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0f1117",
        card: "#171b23",
        card2: "#1c2129",
        line: "rgba(255,255,255,0.07)",
        income: "#34d399",
        expense: "#f87171",
        warn: "#fbbf24",
        muted: "#9aa0aa",
      },
    },
  },
  plugins: [],
};
