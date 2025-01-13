import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function Index() {
  const { firstLaunch, isLogged, loading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (firstLaunch) {
        router.replace('/(onboarding)/onboarding');
      } else {
        if (!isLogged) {
          router.replace('/(auth)/sign-in');
          console.debug('going to signed in');
        } else {
          router.replace('/(tabs)/home');
        }
      }
    }
  }, [loading, firstLaunch, isLogged]);
}
