/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F7F1',
        surface: '#FFFFFF',
        sage: {
          bg: '#F4F7F1',
          surface: '#FFFFFF',
          soft: '#E5EEDC',
          light: '#D4E2C5',
          primary: '#6B8E5A',
          accent: '#8FAF78',
          dark: '#344E41',
          text: '#1F2A22',
          muted: '#6B756D',
          border: 'rgba(52, 78, 65, 0.10)',
        },
        brand: {
          dark: '#344E41',
          primary: '#344E41',
          light: '#4B6B5B',
          accent: '#6B8E5A',
          accentHover: '#587649',
          accentLight: '#E5EEDC',
        },
        ink: {
          DEFAULT: '#1F2A22',
          muted: '#6B756D',
          light: '#8F9991',
          faint: '#E5EEDC',
        },
        status: {
          success: '#4A7C59',
          warning: '#C88A36',
          danger: '#C64545',
          info: '#5B7C99',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(52, 78, 65, 0.05), 0 2px 6px -1px rgba(52, 78, 65, 0.03)',
        'premium': '0 20px 35px -5px rgba(52, 78, 65, 0.08), 0 10px 15px -5px rgba(52, 78, 65, 0.04)',
        'float': '0 25px 50px -12px rgba(52, 78, 65, 0.15)',
        'glow': '0 0 35px -5px rgba(107, 142, 90, 0.25)',
      }
    },
  },
  plugins: [],
}
