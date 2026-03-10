/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        midnight: "#0a1221",
        charcoal: "#161616",
        champagne: "#d4af37",
        platinum: "#c8c8c8",
      },
      boxShadow: {
        glass: "0 20px 70px rgba(0, 0, 0, 0.55)",
      },
      backgroundImage: {
        "hero-vignette":
          "radial-gradient(circle at 18% 22%, rgba(212, 175, 55, 0.18), transparent 45%), radial-gradient(circle at 82% 76%, rgba(10, 18, 33, 0.75), transparent 50%), linear-gradient(120deg, rgba(5, 5, 5, 0.88), rgba(10, 18, 33, 0.7))",
      },
      transitionTimingFunction: {
        "vault-ease": "cubic-bezier(0.18, 0.78, 0.1, 1)",
      },
      letterSpacing: {
        luxe: "0.2em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

