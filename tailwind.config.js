/** @type {import('tailwindcss').Config} */
import nativewindPreset from 'nativewind/preset';

export default {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          lightpink: '#FAF1FF',
          purple: '#9482DA',
          blue: '#B2E3F7',
          yellow: '#F6EA96',
          green: '#CFEE2E',
        },
        secondary: {
          orange: '#E9870E',
          pink: '#E1B1F8',
        },
      },
      fontFamily: {
        PixelifySans: ['PixelifySans'],
        ReadexProRegular: ['ReadexProRegular'],
        ReadexProSemiBold: ['ReadexProSemiBold'],
        ReadexProBold: ['ReadexProBold'],
      },
    },
  },
  plugins: [],
};
