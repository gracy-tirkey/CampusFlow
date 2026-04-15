/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic color system - Dark theme focused
        background: {
          DEFAULT: "#0f172a", // slate-900
          secondary: "#1e293b", // slate-800
          tertiary: "#334155", // slate-700
          elevated: "#475569", // slate-600
        },
        surface: {
          DEFAULT: "#1e293b", // slate-800
          secondary: "#334155", // slate-700
          elevated: "#475569", // slate-600
        },
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          hover: "#2563eb", // blue-600
          active: "#1d4ed8", // blue-700
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#64748b", // slate-500
          hover: "#475569", // slate-600
          active: "#334155", // slate-700
        },
        accent: {
          DEFAULT: "#06b6d4", // cyan-500
          hover: "#0891b2", // cyan-600
          active: "#0e7490", // cyan-700
        },
        text: {
          primary: "#f1f5f9", // slate-100
          secondary: "#cbd5e1", // slate-300
          tertiary: "#94a3b8", // slate-400
          muted: "#64748b", // slate-500
        },
        border: {
          DEFAULT: "#334155", // slate-700
          light: "#475569", // slate-600
          focus: "#3b82f6", // blue-500
        },
        success: {
          DEFAULT: "#10b981", // emerald-500
          hover: "#059669", // emerald-600
        },
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          hover: "#d97706", // amber-600
        },
        error: {
          DEFAULT: "#ef4444", // red-500
          hover: "#dc2626", // red-600
        },
        glass: "rgba(255, 255, 255, 0.05)",
        overlay: "rgba(0, 0, 0, 0.5)",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.15)",
        elevated: "0 4px 16px rgba(0, 0, 0, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
