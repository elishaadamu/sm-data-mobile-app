import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CableScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="tv" size={48} color="#DC2626" />
        </View>
        <Text style={styles.title}>Cable TV</Text>
        <Text style={styles.subtitle}>This service is coming soon!</Text>
        <Text style={styles.description}>
          Subscribe to DSTV, GOTV, Startimes and more cable TV services directly from your wallet.
        </Text>
        <View style={styles.badge}>
          <Ionicons name="time-outline" size={14} color="#D97706" />
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#64748B', marginBottom: 12 },
  description: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#D97706', fontWeight: '700', fontSize: 13 },
});
