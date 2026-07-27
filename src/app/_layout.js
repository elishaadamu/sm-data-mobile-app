import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppContextProvider } from '../context/AppContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AppContextProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
    </AppContextProvider>
  );
}
