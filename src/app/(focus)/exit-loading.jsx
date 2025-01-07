import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import React, { useEffect } from 'react';
import useMessageStore from '@/store/messageStatus';

export default function exitLoading() {
  const message = useMessageStore((state) => state.message);
  useEffect(() => {
    // Navigate to focus timer after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeIn.duration(1000)} exiting={FadeOut} style={styles.text}>
        {message}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'BhalooBold',
    width: '70%',
    textAlign: 'center',
  },
});
