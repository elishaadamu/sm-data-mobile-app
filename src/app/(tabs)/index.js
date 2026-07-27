import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl, API_CONFIG } from '../../config/api';
import { useAppContext } from '../../context/AppContext';
import WalletCard from '../../components/WalletCard';
import ServiceCard from '../../components/ServiceCard';
import TransactionItem from '../../components/TransactionItem';
import EmptyState from '../../components/EmptyState';

export default function HomeScreen() {
  const { userData, walletBalance, walletLoading, notifications, fetchWalletBalance } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [bvn, setBvn] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const services = [
    { name: 'Data', icon: 'cellular', color: '#2563EB', bgColor: '#EFF6FF', route: '/(tabs)/services/data' },
    { name: 'Airtime', icon: 'call', color: '#7C3AED', bgColor: '#F5F3FF', route: '/(tabs)/services/airtime' },
    { name: 'WAEC', icon: 'document-text', color: '#059669', bgColor: '#F0FDF4', route: '/(tabs)/services/waec' },
    { name: 'NECO', icon: 'school', color: '#4F46E5', bgColor: '#EEF2FF', route: '/(tabs)/services/neco' },
    { name: 'Cable TV', icon: 'tv', color: '#DC2626', bgColor: '#FEF2F2', route: null, comingSoon: true },
    { name: 'Electric', icon: 'flash', color: '#D97706', bgColor: '#FFFBEB', route: null, comingSoon: true },
  ];

  const fetchAccountDetails = useCallback(async () => {
    if (!userData) return;
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    try {
      const response = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance + 'balance/' + userId)
      );
      setAccountDetails(response.data?.wallet || null);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  }, [userData]);

  const fetchRecentTransactions = useCallback(async () => {
    if (!userData) return;
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    try {
      setTransactionsLoading(true);
      const response = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.ALL_HISTORY + userId)
      );
      const allTransactions = response.data?.transactions || response.data?.data || [];
      const recent = allTransactions
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 5);
      setRecentTransactions(recent);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchAccountDetails();
    fetchRecentTransactions();
  }, [fetchAccountDetails, fetchRecentTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWalletBalance(), fetchAccountDetails(), fetchRecentTransactions()]);
    setRefreshing(false);
  };

  const handleOrderClick = (tx) => {
    console.log('=== SELECTED RECENT ORDER DETAILS ===');
    console.log(JSON.stringify(tx, null, 2));
    setSelectedTx(tx);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleCreateAccount = async () => {
    if (!bvn.trim() || bvn.length !== 11) {
      Toast.show({ type: 'error', text1: 'Please enter a valid 11-digit BVN' });
      return;
    }

    const userId = userData?.id || userData?._id;
    if (!userId) return;

    setCreateLoading(true);
    try {
      const response = await axios.post(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.CREATE_VIRTUAL + userId),
        { number: bvn }
      );
      Toast.show({ type: 'success', text1: 'Virtual account created!' });
      setShowCreateAccount(false);
      setBvn('');
      setAccountDetails(response.data?.data || response.data?.account || response.data?.wallet);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create account',
        text2: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome, {userData?.fullName || userData?.firstName || 'User'} 👋
            </Text>
            <Text style={styles.headerSubtitle}>Your premium services dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => {}}
          >
            <Ionicons name="notifications-outline" size={22} color="#334155" />
            {notifications.length > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* Notification Banner */}
        {notifications.length > 0 && (
          <View style={styles.notifBanner}>
            <Ionicons name="megaphone" size={16} color="#059669" />
            <Text style={styles.notifText} numberOfLines={2}>
              {notifications[0]?.title ? `${notifications[0].title}: ` : ''}
              {notifications[0]?.message}
            </Text>
          </View>
        )}

        {/* Wallet Card */}
        <WalletCard
          balance={walletBalance}
          loading={walletLoading}
          accountDetails={accountDetails}
          onCreateAccount={() => setShowCreateAccount(true)}
        />

        {/* Services Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <ServiceCard
                name={service.name}
                icon={service.icon}
                color={service.color}
                bgColor={service.bgColor}
                comingSoon={service.comingSoon}
                onPress={() => service.route && router.push(service.route)}
              />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/(tabs)/history')}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="receipt-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.quickActionLabel}>All Orders</Text>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/(tabs)/profile/referrals')}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="gift-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.quickActionLabel}>Refer & Earn</Text>
            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsCard}>
          {transactionsLoading ? (
            <View style={styles.skeletonList}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.skeletonRow} />
              ))}
            </View>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction._id || index}
                transaction={transaction}
                onPress={() => handleOrderClick(transaction)}
              />
            ))
          ) : (
            <EmptyState
              icon="receipt-outline"
              title="No transactions yet"
              message="Your recent transactions will appear here"
            />
          )}
        </View>
      </ScrollView>

      {/* Order Detail Modal */}
      <Modal visible={!!selectedTx} transparent animationType="slide" onRequestClose={() => setSelectedTx(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedTx(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedTx && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailAmountRow}>
                  <Text style={[styles.detailAmount, selectedTx.type === 'credit' ? { color: '#16A34A' } : { color: '#DC2626' }]}>
                    {selectedTx.type === 'credit' ? '+' : '-'}₦{parseFloat(selectedTx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                  <View style={[styles.statusBadge, (selectedTx.status || '').toLowerCase().includes('success') ? styles.statusSuccess : styles.statusPending]}>
                    <Text style={styles.statusText}>{selectedTx.status || 'Successful'}</Text>
                  </View>
                </View>

                <View style={styles.detailsGroup}>
                  {[
                    ['Reference ID', selectedTx.transactionReference || selectedTx.reference || selectedTx.transactionId || selectedTx._id || 'N/A'],
                    ['Order Type', selectedTx.TransactionType || 'Debit'],
                    ['Network Provider', selectedTx.network || 'N/A'],
                    ['Target Phone', selectedTx.phoneNumber || selectedTx.phone || 'N/A'],
                    ['Description', selectedTx.description || '—'],
                    ['Previous Balance', selectedTx.oldBalance ? `₦${parseFloat(selectedTx.oldBalance).toLocaleString()}` : 'N/A'],
                    ['New Balance', selectedTx.newBalance ? `₦${parseFloat(selectedTx.newBalance).toLocaleString()}` : 'N/A'],
                    ['Date & Time', formatDate(selectedTx.createdAt || selectedTx.date)],
                  ].map(([label, value]) => (
                    <View key={label} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailValue} numberOfLines={2}>{value || '—'}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setSelectedTx(null)}>
                  <Text style={styles.modalDoneBtnText}>Done</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Create Virtual Account Modal */}
      <Modal visible={showCreateAccount} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Virtual Account</Text>
            <Text style={styles.modalDescription}>
              Enter your BVN to create a virtual account. Deposits carry a charge of 1.5% + ₦50 (capped at ₦5,000).
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter 11-digit BVN"
              value={bvn}
              onChangeText={setBvn}
              keyboardType="numeric"
              maxLength={11}
              placeholderTextColor="#94A3B8"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleCreateAccount}
                disabled={createLoading}
              >
                <Text style={styles.modalBtnPrimaryText}>
                  {createLoading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => { setShowCreateAccount(false); setBvn(''); }}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  notifBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  notifDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' },
  notifBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 12, padding: 12, marginBottom: 16 },
  notifText: { flex: 1, fontSize: 12, color: '#166534', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  seeAll: { fontSize: 13, color: '#2563EB', fontWeight: '600' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceItem: { width: '31%' },
  quickActions: { gap: 10, marginBottom: 8 },
  quickActionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  quickActionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  quickActionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#334155' },
  transactionsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  skeletonList: { gap: 12 },
  skeletonRow: { height: 56, backgroundColor: '#F1F5F9', borderRadius: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  detailAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailAmount: { fontSize: 26, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusSuccess: { backgroundColor: '#F0FDF4' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize', color: '#334155' },
  detailsGroup: { gap: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', textAlign: 'right', maxWidth: '60%' },
  modalDoneBtn: { marginTop: 24, backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalDoneBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  modalDescription: { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 20 },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 16, color: '#0F172A', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalBtnPrimary: { backgroundColor: '#2563EB' },
  modalBtnPrimaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  modalBtnSecondary: { backgroundColor: '#F1F5F9' },
  modalBtnSecondaryText: { color: '#64748B', fontWeight: '600', fontSize: 15 },
});
