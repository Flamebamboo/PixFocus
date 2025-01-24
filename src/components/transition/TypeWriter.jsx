import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const TypewriterMessage = ({ message, onComplete, color }) => {
  const [displayedText, setDisplayedText] = useState('');
  const animationStarted = useRef(false);

  useEffect(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedText(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.messageWrapper}>
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.text, { color: color || 'black' }]}>{displayedText}</Animated.Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    minHeight: 60,
  },
  text: {
    fontSize: 18,
    fontFamily: 'PixelCodeBold',
    lineHeight: 32,
    textAlign: 'center',
  },
});

export default TypewriterMessage;
