import { Stack } from 'expo-router';

export default function ServicesLayout() {
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
      <Stack.Screen name="data" options={{ title: 'Data Subscription' }} />
      <Stack.Screen name="airtime" options={{ title: 'Airtime Top-up' }} />
      <Stack.Screen name="waec" options={{ title: 'WAEC Scratch Card' }} />
      <Stack.Screen name="neco" options={{ title: 'NECO Scratch Card' }} />
      <Stack.Screen name="cable" options={{ title: 'Cable TV' }} />
      <Stack.Screen name="electric" options={{ title: 'Electricity' }} />
    </Stack>
  );
}
