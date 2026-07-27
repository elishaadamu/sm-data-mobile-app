import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl, API_CONFIG } from '../../../config/api';
import { useAppContext } from '../../../context/AppContext';
import NetworkSelector from '../../../components/NetworkSelector';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { confirmAction, showAlert } from '../../../utils/alert';

const networkMap = { MTN: '1', GLO: '2', '9MOBILE': '3', AIRTEL: '4' };

export default function AirtimeScreen() {
  const { userData, walletBalance, fetchWalletBalance } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];
  const parsedAmount = parseFloat(amount) || 0;

  const handlePurchase = () => {
    const userId = userData?.id || userData?._id;
    if (!userId || !network || !phoneNumber || !amount) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }

    confirmAction(
      'Confirm Purchase',
      `Buy ₦${parsedAmount.toLocaleString()} airtime?\nPhone: ${phoneNumber}`,
      async () => {
        setLoading(true);
        try {
          const response = await axios.post(apiUrl(API_CONFIG.ENDPOINTS.AIRTIME.CREATE), {
            network: networkMap[network] || network,
            amount: parsedAmount,
            phone: phoneNumber,
            userId,
          });
          const txData = response.data.data || response.data;
          showAlert('Success ✅', `₦${txData.amount || parsedAmount} airtime sent to ${txData.mobile_number || phoneNumber}`);
          setNetwork('');
          setPhoneNumber('');
          setAmount('');
          fetchWalletBalance();
        } catch (error) {
          showAlert('Failed ❌', error.response?.data?.message || error.message || 'Failed to purchase airtime.');
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Wallet */}
      <View style={styles.walletRow}>
        <Ionicons name="wallet" size={20} color="#059669" />
        <Text style={styles.walletLabel}>Balance: </Text>
        <Text style={styles.walletAmount}>₦{walletBalance.toLocaleString()}</Text>
      </View>

      {/* Network */}
      <Text style={styles.stepLabel}>Select Network</Text>
      <NetworkSelector selected={network} onSelect={setNetwork} />

      {/* Phone */}
      <Text style={styles.stepLabel}>Phone Number</Text>
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        icon="call-outline"
        style={{ marginBottom: 0 }}
      />

      {/* Amount */}
      <Text style={styles.stepLabel}>Amount</Text>
      <Input
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        icon="cash-outline"
        style={{ marginBottom: 0 }}
      />

      {/* Quick Amounts */}
      <View style={styles.quickAmounts}>
        {quickAmounts.map((amt) => (
          <Button
            key={amt}
            title={`₦${amt.toLocaleString()}`}
            variant={parseFloat(amount) === amt ? 'primary' : 'secondary'}
            onPress={() => setAmount(String(amt))}
            style={styles.quickBtn}
            textStyle={styles.quickBtnText}
          />
        ))}
      </View>

      {/* Summary */}
      {parsedAmount > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Airtime Amount</Text>
            <Text style={styles.summaryValue}>₦{parsedAmount.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total Debit</Text>
            <Text style={styles.totalValue}>₦{parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>
      )}

      <Button
        title={loading ? 'Processing...' : 'Purchase Airtime'}
        onPress={handlePurchase}
        loading={loading}
        disabled={!network || !phoneNumber || !amount || loading}
        style={styles.purchaseBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 110 },
  walletRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 14, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#BBF7D0' },
  walletLabel: { fontSize: 14, color: '#166534', marginLeft: 8 },
  walletAmount: { fontSize: 18, fontWeight: '800', color: '#166534' },
  stepLabel: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 20, marginBottom: 10 },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  quickBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  quickBtnText: { fontSize: 13 },
  summary: { backgroundColor: '#F5F3FF', borderLeftWidth: 4, borderLeftColor: '#7C3AED', borderRadius: 12, padding: 16, marginTop: 20, gap: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#0F172A', fontWeight: '700' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#DDD6FE', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 15, color: '#7C3AED', fontWeight: '700' },
  totalValue: { fontSize: 16, color: '#7C3AED', fontWeight: '800' },
  purchaseBtn: { marginTop: 24, backgroundColor: '#7C3AED' },
});
