// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef4e9',
          100: '#fcdebb',
          200: '#fbce9a',
          300: '#f9b86c',
          400: '#f8aa50',
          500: '#f69524', // color base
          600: '#e08821',
          700: '#af6a1a',
          800: '#875214',
          900: '#673f0f',
        },
        secondary: {
          50: '#efeaf3',
          100: '#cdbcd9',
          200: '#b49cc7',
          300: '#926fae',
          400: '#7d539e',
          500: '#5d2886', // color base
          600: '#55247a',
          700: '#421c5f',
          800: '#33164a',
          900: '#271138',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        md: '0.5rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
