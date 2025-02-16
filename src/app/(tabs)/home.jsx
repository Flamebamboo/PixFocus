import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState, useCallback } from 'react';

import { useGlobalContext } from '@/context/GlobalProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CreateSessionModal } from '@/components/BottomSheet/CreateSessionModal';
import { router } from 'expo-router';
import useTimerStore from '@/store/timerStore';
//UI Components
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faChartBar, faTag } from '@fortawesome/free-solid-svg-icons';
import PressableScale from '@/components/PressableScale';
import useTimerVariant from '@/store/timerVariantStore';
import { TimerArt } from '@/components/TimerArt/TimerArt';
import { formatTimeDisplay } from '@/utils/timeFormat';
import { TimerDisplay } from '@/components/TimerConfig/TimerDisplay';
import COLORS from '@/utils/color';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContext } from '../_layout';
const Home = () => {
  const { user } = useGlobalContext();
  const currentVariant = useTimerVariant((state) => state.variant);
  const duration = useTimerStore((state) => state.duration);
  const color = useTimerStore((state) => state.color);
  const task = useTimerStore((state) => state.task);

  const { navigateWithRipple } = useContext(NavigationContext);

  // Remove useTimer hook since we're just displaying stored duration

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

  //Background changes depending on current equiped focus design
  const [bgColor, setBgColor] = useState('#000');
  const [secondaryColor, setSecondaryColor] = useState('#000');

  const handleBg = (color, secondaryColor) => {
    setBgColor(color);
    setSecondaryColor(secondaryColor);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        <View className="p-5 gap-7 flex-1  ">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="flex-col">
              <Text className="font-PixelCode text-[#aeaeae] text-md">{getGreeting()},</Text>
              <Text className="text-white font-bold text-2xl font-PixelCodeLight">{user ? user.username : 'User'}</Text>
            </View>

            {/* Top right buttons */}
            <View className="flex-row gap-6">
              <PressableScale style={styles.topRightBtn} onPress={() => router.push('/(tabs)/stats-screen')}>
                <Ionicons name="stats-chart" size={24} color="#000" />
              </PressableScale>
              <PressableScale style={styles.topRightBtn} onPress={() => router.push('/(tabs)/settings')}>
                <FontAwesomeIcon icon={faCog} size={24} color="#000" />
              </PressableScale>
            </View>
          </View>

          {/* timer art */}
          <View className="mb-6 justify-center items-center flex-1">
            <View className="flex-1 justify-center items-center">
              {!custom ? (
                <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
                  <TimerArt onColorChange={handleBg} variant={currentVariant} />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={handlePresentModalPress}>
                <View className="mt-5 flex-row items-center justify-center gap-4">
                  <Text className="text-white text-4xl font-PixelCodeLight">{formatTimeDisplay(duration)}</Text>
                  <View style={styles.taskContainer}>
                    <FontAwesomeIcon icon={faTag} size={22} color={color} />
                    <Text style={styles.task}>{task}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* start button */}
            <View className="mb-7">
              <PressableScale style={[styles.button, { backgroundColor: secondaryColor }]} onPress={handleStartSession}>
                <Text style={styles.buttonText}>Start</Text>
              </PressableScale>
            </View>
          </View>
          <CreateSessionModal bottomSheetModalRef={createSessionModalRef} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {
    height: 70,
    justifyContent: 'center',
    borderRadius: 99,
    alignItems: 'center',
    overflow: 'hidden',
    borderCurve: 'continuous',
    width: 300,
    borderWidth: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'ReadexProSemiBold',
    color: '#000',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 99,
  },
  task: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'PixelCode',
  },
  topRightBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Add zIndex to ensure button is clickable
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: '#000',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
  },
});
