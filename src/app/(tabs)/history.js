import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, RefreshControl, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Share } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl, API_CONFIG } from '../../config/api';
import { useAppContext } from '../../context/AppContext';
import TransactionItem from '../../components/TransactionItem';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HistoryScreen() {
  const { userData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [stats, setStats] = useState({ total: 0, credits: 0, debits: 0 });

  const fetchTransactions = useCallback(async () => {
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get(apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.ALL_HISTORY + userId));
      const all = response.data?.transactions || response.data?.data || response.data || [];

      const processed = (Array.isArray(all) ? all : []).map((t) => {
        let network = t.network;
        let phone = t.phone || t.phoneNumber;
        if (!network && t.description) {
          const m = t.description.match(/:\s*([^-]+)\s*-/);
          if (m) network = m[1].trim();
        }
        if (!phone && t.description) {
          const m = t.description.match(/(?:for|-)\s*(\d{11})/);
          if (m) phone = m[1];
        }
        return {
          ...t,
          network: network || 'N/A',
          phoneNumber: phone || 'N/A',
          reference: t.transactionReference || t.reference || t.transactionId || t._id || 'N/A',
          oldBalance: t.oldBalance ?? t.balanceBefore ?? t.previousBalance ?? 'N/A',
          newBalance: t.newBalance ?? t.balanceAfter ?? t.currentBalance ?? 'N/A',
        };
      }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      console.log('Processed Orders Count:', processed.length);
      setTransactions(processed);
      setStats({
        total: processed.length,
        credits: processed.filter((t) => t.type === 'credit').length,
        debits: processed.filter((t) => t.type === 'debit' || !t.type).length,
      });
    } catch (error) {
      console.error('Error fetching transactions history:', error);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleOrderClick = (tx) => {
    console.log('=== SELECTED ORDER DETAILS ===');
    console.log(JSON.stringify(tx, null, 2));
    setSelectedTx(tx);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const filtered = transactions.filter((t) => {
    const isDebit = t.type === 'debit' || !t.type;
    const isCredit = t.type === 'credit';

    if (filterType === 'debit' && !isDebit) return false;
    if (filterType === 'credit' && !isCredit) return false;

    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      t.amount?.toString().includes(s) ||
      t.reference?.toLowerCase().includes(s) ||
      t.TransactionType?.toLowerCase().includes(s) ||
      t.description?.toLowerCase().includes(s)
    );
  });

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleShareReceipt = async (tx) => {
    if (!tx) return;
    const isCredit = tx.type === 'credit';
    const amountStr = `₦${parseFloat(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    const dateStr = formatDate(tx.createdAt || tx.date);
    const ref = tx.reference || tx.transactionReference || tx.transactionId || tx._id || 'N/A';

    const receiptMessage = `
🧾 SM DATA TRANSACTION RECEIPT
---------------------------------
Status: ${tx.status || 'Successful'}
Type: ${tx.TransactionType || 'VTU Order'}
Amount: ${isCredit ? '+' : '-'}${amountStr}
Reference: ${ref}
Phone: ${tx.phoneNumber || 'N/A'}
Network: ${tx.network || 'N/A'}
Description: ${tx.description || '—'}
Date: ${dateStr}
---------------------------------
Thank you for using SM DATA!
  `.trim();

    try {
      await Share.share({
        title: 'SM DATA Order Receipt',
        message: receiptMessage,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  if (loading && transactions.length === 0) return <LoadingSpinner message="Loading orders history..." />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {/* Back Header */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>All your orders and wallet activities</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>{stats.credits}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>{stats.debits}</Text>
            <Text style={styles.statLabel}>Debits</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders by ID, network, amount..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94A3B8"
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'debit', label: `Debits (${stats.debits})` },
            { id: 'credit', label: `Credits (${stats.credits})` },
          ].map((pill) => (
            <TouchableOpacity
              key={pill.id}
              style={[styles.filterPill, filterType === pill.id && styles.filterPillActive]}
              onPress={() => setFilterType(pill.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, filterType === pill.id && styles.filterPillTextActive]}>
                {pill.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions List */}
        <View style={styles.listCard}>
          {filtered.length > 0 ? (
            filtered.map((tx, idx) => (
              <TransactionItem key={tx._id || idx} transaction={tx} onPress={() => handleOrderClick(tx)} />
            ))
          ) : (
            <EmptyState icon="receipt-outline" title="No orders found" message={searchTerm || filterType !== 'all' ? 'Try adjusting your search or filter' : 'Your order history will appear here'} />
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedTx} transparent animationType="slide" onRequestClose={() => setSelectedTx(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedTx(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedTx && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.orderInfoBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                  <Text style={styles.orderInfoBannerText}>
                    Automated Order • Verified Transaction Receipt
                  </Text>
                </View>

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
                    ['Reference ID', selectedTx.reference],
                    ['Order Type', selectedTx.TransactionType || 'Debit'],
                    ['Network Provider', selectedTx.network],
                    ['Target Phone', selectedTx.phoneNumber],
                    ['Description', selectedTx.description],
                    ['Previous Balance', selectedTx.oldBalance !== 'N/A' ? `₦${parseFloat(selectedTx.oldBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'],
                    ['New Balance', selectedTx.newBalance !== 'N/A' ? `₦${parseFloat(selectedTx.newBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'],
                    ['Date & Time', formatDate(selectedTx.createdAt || selectedTx.date)],
                  ].map(([label, value]) => (
                    <View key={label} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailValue} numberOfLines={2}>{value || '—'}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.modalActionButtons}>
                  <TouchableOpacity style={styles.shareBtn} onPress={() => handleShareReceipt(selectedTx)} activeOpacity={0.8}>
                    <Ionicons name="share-social-outline" size={18} color="#2563EB" />
                    <Text style={styles.shareBtnText}>Share Receipt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setSelectedTx(null)} activeOpacity={0.8}>
                    <Text style={styles.modalDoneBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 110 },
  topHeaderBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: -4 },
  backBtn: { paddingRight: 12, paddingVertical: 4 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },
  filterPillsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterPill: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  filterPillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterPillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  orderInfoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, borderWidth: 1, borderColor: '#BBF7D0' },
  orderInfoBannerText: { fontSize: 12, color: '#166534', fontWeight: '600' },
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
  modalActionButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingVertical: 14, borderRadius: 12 },
  shareBtnText: { color: '#2563EB', fontWeight: '700', fontSize: 14 },
  modalDoneBtn: { flex: 1, backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalDoneBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
