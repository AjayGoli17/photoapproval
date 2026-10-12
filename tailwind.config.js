/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F5F0',
          50: '#FCFBF9',
          100: '#F7F5F0',
          200: '#EFECE4',
          300: '#E3DFD5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          muted: '#FBF9F6',
          hover: '#F5F2EB',
        },
        charcoal: {
          DEFAULT: '#292925',
          50: '#F5F5F4',
          100: '#E7E6E4',
          200: '#CFCDCA',
          300: '#A8A59E',
          400: '#7B7873',
          500: '#5F5C57',
          600: '#464440',
          700: '#353430',
          800: '#292925',
          900: '#1C1C19',
        },
        terracotta: {
          DEFAULT: '#B96F52',
          light: '#F8EFEA',
          subtle: '#ECD8CE',
          border: '#DCB2A1',
          hover: '#A35D43',
          dark: '#8C4D36',
        },
        sage: {
          DEFAULT: '#6F816B',
          light: '#EFF3EE',
          subtle: '#D7E0D5',
          border: '#B3C4B0',
          hover: '#5D6E5A',
          dark: '#4C5B49',
        },
        amber: {
          DEFAULT: '#D99B26',
          light: '#FEF8EC',
          subtle: '#FCE7C2',
          border: '#F2CD86',
          hover: '#C2871A',
          dark: '#9F6C0E',
        },
        rose: {
          DEFAULT: '#C84B4B',
          light: '#FDF2F2',
          subtle: '#F9D5D5',
          border: '#EFA4A4',
          hover: '#B13B3B',
          dark: '#932D2D',
        },
        border: {
          DEFAULT: '#E6E2DA',
          muted: '#EFECE5',
          strong: '#DDD8CE',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '14px',
        'subtle': '10px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(41, 41, 37, 0.04), 0 1px 2px -1px rgba(41, 41, 37, 0.04)',
        'elevated': '0 4px 16px -2px rgba(41, 41, 37, 0.06), 0 2px 6px -2px rgba(41, 41, 37, 0.04)',
        'modal': '0 12px 36px -4px rgba(41, 41, 37, 0.12), 0 4px 12px -2px rgba(41, 41, 37, 0.06)',
      }
    },
  },
  plugins: [],
}
