/** @type {import('tailwindcss').Config} */
import nativewindPreset from 'nativewind/preset';

export default {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      fontFamily: {
        //pixelcode
        PixelCodeMedium: ['PixelCodeMedium'],
        PixelCodeBold: ['PixelCodeBold'],
        PixelCodeLight: ['PixelCodeLight'],
        PixelCodeDemiBoldItalic: ['PixelCodeDemiBoldItalic'],
        PixelCode: ['PixelCode'],
      },
    },
  },
  plugins: [],
};
