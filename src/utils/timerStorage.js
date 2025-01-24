import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMER_STATE_KEY = '@timer_state';

export const saveTimerState = async (state) => {
  try {
    await AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
    // console.log('Timer state saved:', state);
  } catch (error) {
    console.error('Error saving timer state:', error);
  }
};

export const loadTimerState = async () => {
  try {
    const state = await AsyncStorage.getItem(TIMER_STATE_KEY);
    // console.log('Timer state loaded:', state);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error loading timer state:', error);
    return null;
  }
};

export const clearTimerState = async () => {
  try {
    await AsyncStorage.removeItem(TIMER_STATE_KEY);
  } catch (error) {
    console.error('Error clearing timer state:', error);
  }
};
