/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:     "#1A73E8",
        primaryDark: "#1558B0",
        accent:      "#00BFA5",
        danger:      "#E53935",
        success:     "#43A047",
        dark:        "#0D1117",
        darkCard:    "#161B22",
        cardInner:   "#0e1318",
        sidebar:     "#1C2333",
        border:      "#30363D",
        textPrim:    "#E6EDF3",
        textSec:     "#8B949E",
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      animation: {
        heroFloat:  "heroFloat 4s ease-in-out infinite",
        waveBar:    "waveBar 0.7s ease-in-out infinite alternate",
        spinSlow:   "spinSlow 12s linear infinite",
        pulseGlow:  "pulseGlow 2s infinite",
        fadeUp:     "fadeUp 0.7s ease both",
        fadeLeft:   "fadeLeft 0.7s ease both",
        fadeRight:  "fadeRight 0.7s ease both",
        ticker:     "ticker 28s linear infinite",
      },
      keyframes: {
        heroFloat:  { "0%,100%": { transform:"translateY(0)" },    "50%": { transform:"translateY(-10px)" } },
        waveBar:    { from: { transform:"scaleY(1)" },             to:   { transform:"scaleY(0.25)" } },
        spinSlow:   { to:   { transform:"rotate(360deg)" } },
        pulseGlow:  { "0%,100%": { opacity:"0.5" },               "50%": { opacity:"1" } },
        fadeUp:     { from: { opacity:"0", transform:"translateY(32px)" },  to: { opacity:"1", transform:"translateY(0)" } },
        fadeLeft:   { from: { opacity:"0", transform:"translateX(-32px)" }, to: { opacity:"1", transform:"translateX(0)" } },
        fadeRight:  { from: { opacity:"0", transform:"translateX(32px)" },  to: { opacity:"1", transform:"translateX(0)" } },
        ticker:     { from: { transform:"translateX(0)" },         to:   { transform:"translateX(-50%)" } },
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #1A73E8, #1558B0)",
        "grad-accent":  "linear-gradient(135deg, #1A73E8, #00BFA5)",
      },
    },
  },
  plugins: [],
}