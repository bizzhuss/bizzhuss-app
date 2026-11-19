/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // Bizzhuss Primary
          700: '#0f766e', // Deep Teal
          800: '#115e59',
          900: '#134e4a',
          primary: '#0d9488',
          secondary: '#f59e0b', // Amber Accent
          accent: '#6366f1',
          dark: '#0f172a',
          surface: '#f8fafc',
          muted: '#64748b',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
};
