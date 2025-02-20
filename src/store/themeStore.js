import { create } from 'zustand';

//Note to myself use themeStore for components the uses dynamic themes, for constant/default values go to colors util

const themeDefinitions = {
  COFFEE_CUP: {
    primary: '#EFB6C8',
    secondary: '#A888B5',
    accent: '#FFF',
    text: '#fff',
    iconFill: '#373737',
    buttonBorder: '#000',
  },
  FIRE_CAMP: {
    primary: '#241515',
    secondary: '#F4D793',
    accent: '#A94A4A',
    text: '#ffff',
    iconFill: '#241515',
    buttonBorder: '#000',
  },
};

const useThemeStore = create((set, get) => ({
  currentTheme: 'COFFEE_CUP',
  colors: themeDefinitions.COFFEE_CUP,

  setTheme: (themeName) => {
    if (themeDefinitions[themeName]) {
      set({
        currentTheme: themeName,
        colors: themeDefinitions[themeName],
      });
    }
  },

  getColor: (colorName) => {
    const { colors } = get();
    return colors[colorName];
  },
}));

export default useThemeStore;
