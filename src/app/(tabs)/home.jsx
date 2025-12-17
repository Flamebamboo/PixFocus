import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useCallback } from 'react';
import { moderateScale, fontScale, scale } from '@/utils/responsive';
import { useGlobalContext } from '@/context/GlobalProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CreateSessionModal } from '@/components/BottomSheet/CreateSessionModal';
import { router } from 'expo-router';
import useTimerStore from '@/store/timerStore';
//UI Components
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBoltLightning, faCog, faGlobe, faTag } from '@fortawesome/free-solid-svg-icons';
import PressableScale from '@/components/PressableScale';
import useTimerVariant from '@/store/timerVariantStore';
import { TimerArt } from '@/components/TimerArt/TimerArt';
import { formatTimeDisplay } from '@/utils/timeFormat';
import COLORS from '@/utils/color';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContext } from '../_layout';
import useThemeStore from '@/store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const { user } = useGlobalContext();
  const currentVariant = useTimerVariant((state) => state.variant);
  const duration = useTimerStore((state) => state.duration);
  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);
  const { navigateWithRipple } = useContext(NavigationContext);
  const [quote, setQuote] = useState('Focus on being productive instead of busy.');

  // Get the current theme colors
  const colors = useThemeStore((state) => state.colors);

  // Update theme when variant changes - FIXING THE HOOK ISSUE
  useEffect(() => {
    // Get the setTheme function from the store
    const setTheme = useThemeStore.getState().setTheme;
    // Call the function directly without using a hook inside a hook
    setTheme(currentVariant);
  }, [currentVariant]);

  // Collection of productivity and focus quotes
  const quotes = [
    'Focus on being productive instead of busy.',
    "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    'Productivity is never an accident. It is always the result of a commitment to excellence.',
    "You don't get results by focusing on results. You get results by focusing on the actions.",
    "Focus is a matter of deciding what things you're not going to do.",
    'The successful warrior is the average man, with laser-like focus.',
    "It's not always that we need to do more but rather that we need to focus on less.",
    'The shorter way to do many things is to only do one thing at a time.',
    'Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.',
  ];

  // Quote management with better error handling
  useEffect(() => {
    const checkAndUpdateDailyQuote = async () => {
      try {
        // Get the current date as a string
        const today = new Date().toDateString();

        // Try to get the last saved quote date
        const lastQuoteDate = await AsyncStorage.getItem('pixfocus_quote_date');

        if (lastQuoteDate !== today) {
          // It's a new day or first launch, get a new random quote
          const randomIndex = Math.floor(Math.random() * quotes.length);
          const todaysQuote = quotes[randomIndex];

          // Update the state
          setQuote(todaysQuote);

          // Save to AsyncStorage with better error handling
          try {
            await AsyncStorage.setItem('pixfocus_quote_date', today);
            await AsyncStorage.setItem('pixfocus_current_quote', todaysQuote);
          } catch (storageError) {
            console.error('Failed to save quote to storage:', storageError);
          }
        } else {
          // Same day, retrieve saved quote
          try {
            const savedQuote = await AsyncStorage.getItem('pixfocus_current_quote');
            if (savedQuote) {
              setQuote(savedQuote);
            }
          } catch (retrieveError) {
            console.error('Failed to retrieve saved quote:', retrieveError);
          }
        }
      } catch (error) {
        console.error('Error in quote management:', error);
        // Ensure we still show a quote even if there's an error
        const fallbackIndex = new Date().getDay() % quotes.length;
        setQuote(quotes[fallbackIndex]);
      }
    };

    checkAndUpdateDailyQuote();
  }, []);

  //BottomSheet Related
  const createSessionModalRef = useRef(null);
  const handlePresentModalPress = useCallback(() => {
    createSessionModalRef.current?.present();
  }, []);

  const handleStartSession = () => {
    if (task === 'Select Task') {
      Alert.alert('Invalid Task', 'Please select a task before creating a session');
      return;
    }
    navigateWithRipple('/(focus)/enter-loading');
  };

  //Top Left
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'good morning';
    if (hour < 18) return 'good afternoon';
    return 'good night';
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greetingText, { color: colors.accent }]}>{getGreeting()},</Text>
              <Text style={[styles.usernameText, { color: colors.text }]}>{user ? user.username : 'User'}</Text>
            </View>

            {/* Top right buttons */}
            <View className="flex-row gap-2">
              <PressableScale style={styles.topRightBtn} onPress={() => router.push('/(tabs)/stats-screen')}>
                <Ionicons name="stats-chart" size={24} color="#000" />
              </PressableScale>

              {/* <PressableScale style={styles.topRightBtn} onPress={() => router.push('/(tabs)/streaks')}>
                <FontAwesomeIcon icon={faBoltLightning} size={20} color="#000" />
              </PressableScale> */}
              <PressableScale style={styles.topRightBtn} onPress={() => router.push('/(tabs)/settings')}>
                <FontAwesomeIcon icon={faCog} size={24} color="#000" />
              </PressableScale>
            </View>
          </View>

          {/* Timer art centered in available space */}
          <View style={styles.timerContainer}>
            {/* Simple quote text */}
            <Text style={[styles.quoteText, { color: colors.accent }]}>{quote}</Text>

            <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
              <TimerArt variant={currentVariant} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePresentModalPress}>
              <View style={styles.timerControls}>
                <Text style={[styles.timeText, { color: colors.text }]}>{formatTimeDisplay(duration)}</Text>
                <View
                  style={[
                    styles.taskContainer,
                    { backgroundColor: colors.secondary, borderColor: colors.buttonBorder },
                  ]}
                >
                  <FontAwesomeIcon icon={faTag} size={22} color={color} />
                  <Text style={[styles.task, { color: colors.iconFill }]}>{task}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Start button */}
          <View style={styles.buttonContainer}>
            <PressableScale
              style={[
                styles.button,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.buttonBorder,
                },
              ]}
              onPress={handleStartSession}
            >
              <Text style={[styles.buttonText, { color: colors.iconFill }]}>Start</Text>
            </PressableScale>
          </View>
          {/* Leaderboard button positioned at bottom right */}
          <PressableScale style={styles.leaderboardButton} onPress={() => router.push('/(tabs)/leaderboard')}>
            <FontAwesomeIcon icon={faGlobe} size={24} color={colors.iconFill} />
          </PressableScale>
        </View>
        <CreateSessionModal bottomSheetModalRef={createSessionModalRef} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quoteText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: fontScale(14),
    textAlign: 'center',
    marginBottom: moderateScale(30),
    paddingHorizontal: moderateScale(20),
    lineHeight: fontScale(22),
    width: '90%',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  timerControls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  timeText: {
    fontSize: fontScale(36),
    fontFamily: 'PixelCodeLight',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  button: {
    height: moderateScale(70),
    justifyContent: 'center',
    borderRadius: moderateScale(30),
    alignItems: 'center',
    overflow: 'hidden',
    width: moderateScale(300),
    borderWidth: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: fontScale(20),
    position: 'absolute',
    fontFamily: 'PixelCodeBold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(30),
    borderWidth: 4,
  },
  task: {
    fontSize: fontScale(16),
    marginLeft: moderateScale(8),
    fontFamily: 'PixelCodeMedium',
  },
  topRightBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: moderateScale(9),
    borderColor: '#000',
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: '#fff',
  },
  leaderboardButton: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: moderateScale(25),
    borderColor: '#000',
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: '#fff',
  },
  greetingText: {
    fontFamily: 'PixelCode',
    fontSize: fontScale(16),
  },
  usernameText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: fontScale(20),
  },
});
