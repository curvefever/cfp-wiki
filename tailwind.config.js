/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        asap: ['var(--font-asap)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        bg: {
          DEFAULT: '#153C58',
          dark: '#112f44',
          darker: '#112f44',
          darkest: '#0e2636',
        },
        text: {
          DEFAULT: '#FFFFFF'
        },
        gray: '#AAAAAA',
        dark: '#000000',
        light: '#FFFFFF',
        primary: {
          DEFAULT: '#34A3CE',
          light: '#51b0d5',
          dark: '#1c7094'
        },
        secondary: {
          DEFAULT: '#18b3ad',
          light: '#1ee0d8',
          dark: '#128682'
        },
        danger: {
          DEFAULT: '#E0353D',
          light: '#e76167',
          dark: '#c41e26'
        },
        success: {
          DEFAULT: '#48E271',
          light: '#74e993',
          dark: '#207332'
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}