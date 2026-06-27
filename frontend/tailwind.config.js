/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B1F22",
          900: "#0F2A2E",
          800: "#163B40",
          700: "#1E4D54",
        },
        paper: {
          50: "#FAF8F4",
          100: "#F2EFE7",
        },
        amber: {
          400: "#E8A23D",
          500: "#D98B22",
        },
        signal: {
          green: "#5FA88A",
          red: "#C8694C",
        },
      },
      fontFamily: {
        display: ["'Spectral'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        scan: "scan 2.2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
