/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: {
          DEFAULT: "#111113",
          elevated: "#18181B",
          hover: "#202024",
        },
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          muted: "rgba(124, 58, 237, 0.15)",
        },
        secondary: {
          DEFAULT: "#A855F7",
          hover: "#9333EA",
        },
        ai: {
          DEFAULT: "#C084FC",
          glow: "rgba(192, 132, 252, 0.2)",
          surface: "rgba(192, 132, 252, 0.05)",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        borderToken: "rgba(255, 255, 255, 0.08)",
        borderHover: "rgba(255, 255, 255, 0.16)",
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(124, 58, 237, 0.3)",
        aiGlow: "0 0 25px -5px rgba(192, 132, 252, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
