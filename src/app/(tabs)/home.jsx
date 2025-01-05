import React, { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { TimerArt } from '@/components/TimerArt/TimerArt';
import { StartFocus } from '@/components/StartFocus';
import useTimerVariant from '@/store/timerVariantStore';
import { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CreateSessionModal } from '@/components/BottomSheet/CreateSessionModal';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { faCog, faChartBar } from '@fortawesome/free-solid-svg-icons';
import PressableScale from '@/components/PressableScale';
const Home = () => {
  const { user } = useGlobalContext();
  const currentVariant = useTimerVariant((state) => state.variant);
  const createSessionModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    createSessionModalRef.current?.present();
  }, []);
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'good morning';
    if (hour < 18) return 'good afternoon';
    return 'good night';
  };

  const [bgColor, setBgColor] = useState('#000');
  const handleBg = (color) => {
    setBgColor(color);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: bgColor }}>
        <View className="p-5 gap-7 flex-1  ">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="flex-col">
              <Text className="font-PixelifySans text-[#aeaeae] text-xl">{getGreeting()},</Text>
              <Text className="text-white font-bold text-3xl font-PixelifySans">{user ? user.username : 'User'}</Text>
            </View>
            <View className="flex-row gap-6">
              <TouchableOpacity onPress={() => router.push('/(tabs)/stats-screen')}>
                <FontAwesomeIcon icon={faChartBar} size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
                <FontAwesomeIcon icon={faCog} size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6 justify-center items-center flex-1">
            <View className="flex-1 justify-center items-center">
              <TouchableOpacity onPress={() => router.push('/(shop)/focus-design')}>
                <TimerArt onColorChange={handleBg}></TimerArt>
              </TouchableOpacity>
            </View>

            <View className="mb-7">
              <PressableScale style={styles.button} onPress={handlePresentModalPress}>
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
    backgroundColor: 'white',
    borderRadius: 99,
    alignItems: 'center',
    overflow: 'hidden',
    borderCurve: 'continuous',
    width: 300,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    fontFamily: 'PixelifySans',
  },
});
