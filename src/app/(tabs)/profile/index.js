import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../../context/AppContext';

export default function ProfileScreen() {
  const { userData, logout, walletBalance } = useAppContext();

  const menuItems = [
    { icon: 'person-outline', label: 'Personal Details', route: '/(tabs)/profile/edit', color: '#2563EB' },
    { icon: 'gift-outline', label: 'Refer & Earn', route: '/(tabs)/profile/referrals', color: '#059669' },
    { icon: 'lock-closed-outline', label: 'Change Password', route: '/(tabs)/profile/change-password', color: '#7C3AED' },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userData?.fullName || userData?.firstName || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{userData?.fullName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'No email'}</Text>
          <View style={styles.balancePill}>
            <Ionicons name="wallet" size={14} color="#2563EB" />
            <Text style={styles.balanceText}>₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{userData?.role || 'user'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData?.phone || '—'}</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SM DATA Mobile v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 28, paddingTop: 20 },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  userName: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#64748B' },
  balancePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  balanceText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#334155' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24, gap: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
  roleBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  roleText: { fontSize: 12, color: '#2563EB', fontWeight: '700', textTransform: 'capitalize' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#DC2626' },
  version: { textAlign: 'center', fontSize: 12, color: '#CBD5E1', marginTop: 20 },
});
