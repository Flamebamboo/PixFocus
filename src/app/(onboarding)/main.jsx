import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/Onboarding/CustomButton';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Image } from 'expo-image';
const { width, height } = Dimensions.get('window');
import { router } from 'expo-router';
import COLORS from '@/utils/color';
const Main = () => {
  return (
    <View>
      <View style={styles.slide}>
        <Text style={styles.title}>PixFocus</Text>
        {/* final image here later*/}
        <Text style={styles.description}>"Watcha waiting for? Start focusing now!"</Text>
        <Image
          style={styles.image}
          contentFit="contain"
          transition={1000}
          source={require('assets/images/NewIcon.png')}
        />

        <Animated.View
          entering={FadeInDown.duration(400)}
          exiting={FadeOut.duration(100)}
          style={{ paddingBottom: 30, marginTop: 20 }}
        >
          <CustomButton
            label="Get Started"
            variant="solid"
            style={{ borderWidth: 4, borderColor: '#000', height: 60 }}
            fontSize={18}
            color={'#000'}
            backgroundColor={COLORS.green}
            onPress={() => router.push('/(auth)/sign-up')}
          />
          <CustomButton
            fontSize={16}
            label="I ALREADY HAVE AN ACCOUNT"
            rightIcon="chevron-right"
            color={'white'}
            variant="transparent"
            onPress={() => router.push('/(auth)/sign-in')}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: 'flex-start',
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.purple,
  },
  title: {
    fontSize: 54,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  description: {
    postion: 'absolute',
    top: 80,
    zIndex: 100,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PixelCodeBold',
  },
  image: {
    width: '100%',
    height: '60%',
  },
});
