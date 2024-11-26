import React from 'react'
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { UserProvider } from './hooks/UserContext';
import { GlobalStyleProvider } from './hooks/GlobalStyleContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    TitleFont: require('../assets/fonts/Bakbakone.ttf'),
    TextFont: require('../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Wait until fonts are loaded
  }


  return (
    <UserProvider>
      <GlobalStyleProvider>

        <Stack initialRouteName='index'>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='register' options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />


      </GlobalStyleProvider>
    </UserProvider>

  )
}