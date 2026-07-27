import React from 'react';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ fallback = '/(tabs)/profile' }) => (
  <TouchableOpacity
    onPress={() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(fallback);
      }
    }}
    style={{ paddingRight: 12, paddingVertical: 4 }}
    activeOpacity={0.7}
  >
    <Ionicons name="chevron-back" size={26} color="#0F172A" />
  </TouchableOpacity>
);

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F8FAFC' },
        headerTintColor: '#0F172A',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="change-password" options={{ title: 'Password Management' }} />
      <Stack.Screen name="referrals" options={{ title: 'Refer & Earn' }} />
    </Stack>
  );
}
