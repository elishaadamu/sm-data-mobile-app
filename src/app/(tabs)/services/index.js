import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import ServiceCard from '../../../components/ServiceCard';

const allServices = [
  { name: 'Data', icon: 'cellular', color: '#2563EB', bgColor: '#EFF6FF', route: '/(tabs)/services/data' },
  { name: 'Airtime', icon: 'call', color: '#7C3AED', bgColor: '#F5F3FF', route: '/(tabs)/services/airtime' },
  { name: 'WAEC', icon: 'document-text', color: '#059669', bgColor: '#F0FDF4', route: '/(tabs)/services/waec' },
  { name: 'NECO', icon: 'school', color: '#4F46E5', bgColor: '#EEF2FF', route: '/(tabs)/services/neco' },
  { name: 'Cable TV', icon: 'tv', color: '#DC2626', bgColor: '#FEF2F2', route: '/(tabs)/services/cable', comingSoon: true },
  { name: 'Electricity', icon: 'flash', color: '#D97706', bgColor: '#FFFBEB', route: '/(tabs)/services/electric', comingSoon: true },
];

export default function ServicesIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Services</Text>
        <Text style={styles.subtitle}>Premium VTU services at your fingertips</Text>

        <View style={styles.grid}>
          {allServices.map((service, index) => (
            <View key={index} style={styles.gridItem}>
              <ServiceCard
                name={service.name}
                icon={service.icon}
                color={service.color}
                bgColor={service.bgColor}
                comingSoon={service.comingSoon}
                onPress={() => service.route && !service.comingSoon && router.push(service.route)}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            All services are available 24/7. Contact our support team for any assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 30 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  infoCard: { marginTop: 28, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#64748B', lineHeight: 20 },
});
