import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ServiceCard from '../../../components/ServiceCard';
import WhatsAppSupport from '../../../components/WhatsAppSupport';

const allServices = [
  { name: 'Data', desc: 'MTN, Airtel, Glo, 9mobile SME & Corporate', icon: 'cellular', color: '#2563EB', bgColor: '#EFF6FF', route: '/(tabs)/services/data' },
  { name: 'Airtime', desc: 'Instant VTU top-up for all networks', icon: 'call', color: '#7C3AED', bgColor: '#F5F3FF', route: '/(tabs)/services/airtime' },
  { name: 'WAEC', desc: 'Official Scratch Card & Result Checker PIN', icon: 'document-text', color: '#059669', bgColor: '#F0FDF4', route: '/(tabs)/services/waec' },
  { name: 'NECO', desc: 'Instant NECO Token for Result Verification', icon: 'school', color: '#4F46E5', bgColor: '#EEF2FF', route: '/(tabs)/services/neco' },
  { name: 'Cable TV', desc: 'DSTV, GOTV & Startimes Subscription', icon: 'tv', color: '#DC2626', bgColor: '#FEF2F2', route: '/(tabs)/services/cable', comingSoon: true },
  { name: 'Electricity', desc: 'Prepaid & Postpaid Meter Tokens', icon: 'flash', color: '#D97706', bgColor: '#FFFBEB', route: '/(tabs)/services/electric', comingSoon: true },
];

export default function ServicesIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Services</Text>
        <Text style={styles.subtitle}>Premium automated VTU services at your fingertips</Text>

        {/* Services Grid */}
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
              <Text style={styles.serviceDesc} numberOfLines={2}>{service.desc}</Text>
            </View>
          ))}
        </View>

        {/* Platform Features Highlight */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Why Choose SM DATA?</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="flash-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Instant Automated Delivery</Text>
                <Text style={styles.featureSub}>Orders process automatically in 1–5 seconds</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBg, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Safe & Secure Transactions</Text>
                <Text style={styles.featureSub}>Encrypted virtual wallet and transaction receipts</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBg, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="time-outline" size={20} color="#7C3AED" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>24/7 Service Availability</Text>
                <Text style={styles.featureSub}>Buy data, airtime, & pins anytime round the clock</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Need Help Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="headset-outline" size={22} color="#2563EB" />
            <Text style={styles.infoTitle}>Need Customer Support?</Text>
          </View>
          <Text style={styles.infoText}>
            Our automated VTU system runs 24/7. If you have any inquiries or order updates, feel free to reach out to our dedicated support team.
          </Text>
        </View>
      </ScrollView>
      <WhatsAppSupport />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridItem: { width: '48%' },
  serviceDesc: { fontSize: 11, color: '#94A3B8', marginTop: 6, paddingHorizontal: 4, lineHeight: 15 },
  featuresSection: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  featureList: { gap: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIconBg: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: '#334155' },
  featureSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  infoText: { fontSize: 13, color: '#64748B', lineHeight: 20 },
});
