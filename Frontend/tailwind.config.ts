import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E14",
        surface: "#11151C",
        surface2: "#161B24",
        line: "#232A38",
        ink: "#E7E9EE",
        muted: "#8B93A7",
        blue: "#5FA8FF",
        green: "#7EE787",
        orange: "#F2A65A",
        purple: "#C792EA",
        red: "#F27878",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Poppins"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
