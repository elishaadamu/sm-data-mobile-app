import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, RefreshControl, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
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
  const [selectedTx, setSelectedTx] = useState(null);
  const [stats, setStats] = useState({ total: 0, credits: 0, debits: 0 });

  const fetchTransactions = useCallback(async () => {
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.get(apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.ALL_HISTORY + userId));
      const all = response.data?.transactions || response.data?.data || [];

      const processed = all.map((t) => {
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
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTransactions(processed);
      setStats({
        total: processed.length,
        credits: processed.filter((t) => t.type === 'credit').length,
        debits: processed.filter((t) => t.type === 'debit').length,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
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

  const filtered = transactions.filter((t) => {
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
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading && transactions.length === 0) return <LoadingSpinner message="Loading history..." />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>All your wallet activities</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
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
            placeholder="Search transactions..."
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

        {/* Transactions List */}
        <View style={styles.listCard}>
          {filtered.length > 0 ? (
            filtered.map((tx, idx) => (
              <TransactionItem key={tx._id || idx} transaction={tx} onPress={() => setSelectedTx(tx)} />
            ))
          ) : (
            <EmptyState icon="receipt-outline" title="No transactions found" message={searchTerm ? 'Try a different search term' : 'Your transactions will appear here'} />
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedTx} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transaction Details</Text>
              <TouchableOpacity onPress={() => setSelectedTx(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedTx && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailAmountRow}>
                  <Text style={[styles.detailAmount, selectedTx.type === 'credit' ? { color: '#16A34A' } : { color: '#DC2626' }]}>
                    {selectedTx.type === 'credit' ? '+' : '-'}₦{parseFloat(selectedTx.amount || 0).toLocaleString()}
                  </Text>
                  <View style={[styles.statusBadge, selectedTx.status?.toLowerCase().includes('success') ? styles.statusSuccess : styles.statusPending]}>
                    <Text style={styles.statusText}>{selectedTx.status || 'Unknown'}</Text>
                  </View>
                </View>
                {[
                  ['Transaction ID', selectedTx.reference],
                  ['Type', selectedTx.TransactionType],
                  ['Phone', selectedTx.phoneNumber],
                  ['Network', selectedTx.network],
                  ['Description', selectedTx.description],
                  ['Previous Balance', selectedTx.oldBalance !== 'N/A' ? `₦${parseFloat(selectedTx.oldBalance).toLocaleString()}` : 'N/A'],
                  ['New Balance', selectedTx.newBalance !== 'N/A' ? `₦${parseFloat(selectedTx.newBalance).toLocaleString()}` : 'N/A'],
                  ['Date', formatDate(selectedTx.createdAt || selectedTx.date)],
                ].map(([label, value]) => (
                  <View key={label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>{value || '—'}</Text>
                  </View>
                ))}
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
  scrollContent: { padding: 20, paddingBottom: 30 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  detailAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailAmount: { fontSize: 28, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusSuccess: { backgroundColor: '#F0FDF4' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize', color: '#334155' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', textAlign: 'right', maxWidth: '60%' },
});
