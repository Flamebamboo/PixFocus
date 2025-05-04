//root _layout jsx
import { View } from 'react-native';
import React, { useEffect, useCallback, useState, createContext } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import '../../global.css';
import GlobalProvider from '../context/GlobalProvider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import { Toaster } from 'sonner-native';
import RippleEffect from '@/components/transition/RippleEffect';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export const NavigationContext = createContext(null);

const RootLayout = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const navigateWithRipple = useCallback(
    (routeName) => {
      if (isAnimating) return; // Prevent multiple navigations
      setIsAnimating(true);
      setTimeout(() => {
        router.replace(routeName);
      }, 600);
    },
    [isAnimating, router]
  );

  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    //pixelCode
    PixelCode: require('assets/fonts/PixelCode.ttf'),
    PixelCodeDemiBoldItalic: require('assets/fonts/PixelCode-DemiBold-Italic.ttf'),
    PixelCodeBold: require('assets/fonts/PixelCode-Bold.ttf'),
    PixelCodeMedium: require('assets/fonts/PixelCode-Medium.ttf'),
    PixelCodeLight: require('assets/fonts/PixelCode-Light.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hide();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <NavigationContext.Provider value={{ navigateWithRipple }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <KeyboardProvider>
                  <Stack
                    screenOptions={{
                      // Change animation to vertical
                      animation: 'fade', // or 'fade_from_bottom', 'none', 'slide_from_bottom'
                      // You can also use these properties for more control:

                      headerShown: false,
                    }}
                  >
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(shop)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(focus)" options={{ headerShown: false }} />

                    <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                  </Stack>
                </KeyboardProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </View>
          <Toaster />
        </GestureHandlerRootView>
        {isAnimating && <RippleEffect onAnimationEnd={handleAnimationEnd} />}
      </NavigationContext.Provider>
    </GlobalProvider>
  );
};

export default RootLayout;
