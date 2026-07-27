import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F8FAFC' },
        headerTintColor: '#0F172A',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="change-password" options={{ title: 'Password Management' }} />
      <Stack.Screen name="referrals" options={{ title: 'Refer & Earn' }} />
    </Stack>
  );
}
