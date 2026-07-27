import React, { useState, useEffect, useMemo } from 'react';
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

export default function DataScreen() {
  const { userData, walletBalance, fetchWalletBalance } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [plansLoading, setPlansLoading] = useState(false);

  const formatValidity = (val) => {
    if (!val) return '';
    const valStr = String(val).trim();
    if (valStr.toLowerCase().includes('day') || valStr.toLowerCase().includes('month') || valStr.toLowerCase().includes('hour')) {
      return valStr;
    }
    return `${valStr} days`;
  };

  useEffect(() => {
    if (!selectedNetwork) { setPlans([]); return; }
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const response = await axios.get(apiUrl(API_CONFIG.ENDPOINTS.DATA.GET_BY_NETWORK + selectedNetwork));
        const plansData = Array.isArray(response.data) ? response.data : response.data.data || response.data.plans || response.data.dataPlans || [];
        const formatted = plansData
          .filter((p) => p.isActive !== false)
          .map((p) => ({
            ...p,
            plan_code: p.planId || p.plan_code || '',
            label: p.planName || p.label || 'Data Plan',
            amount: p.sellingPrice ?? p.price ?? p.amount ?? 0,
            validity: p.validity || '30',
          }));
        setPlans(formatted);
      } catch (error) {
        setPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, [selectedNetwork]);

  const selectedPlanDetails = useMemo(() => {
    if (!selectedPlanId) return null;
    return plans.find((p) => p.plan_code === selectedPlanId);
  }, [selectedPlanId, plans]);

  const handlePurchase = () => {
    const userId = userData?.id || userData?._id;
    if (!userId) { Toast.show({ type: 'error', text1: 'User not found' }); return; }
    if (!selectedPlanId || !phoneNumber) { Toast.show({ type: 'error', text1: 'Please fill all fields' }); return; }

    const selectedPlan = plans.find((p) => p.plan_code === selectedPlanId);
    if (!selectedPlan) return;

    const getNetworkNumber = (net) => {
      switch (net?.toUpperCase()) {
        case 'MTN': return '1';
        case 'GLO': return '2';
        case '9MOBILE': return '3';
        case 'AIRTEL': return '4';
        default: return net;
      }
    };

    confirmAction(
      'Confirm Purchase',
      `Buy ${selectedPlan.label} for ₦${selectedPlan.amount.toLocaleString()}?\nPhone: ${phoneNumber}`,
      async () => {
        setLoading(true);
        try {
          const response = await axios.post(apiUrl(API_CONFIG.ENDPOINTS.DATA.CREATE), {
            network: getNetworkNumber(selectedNetwork),
            phone: phoneNumber,
            PlanId: selectedPlanId,
            userId,
            amount: selectedPlan.amount,
          });
          const txData = response.data.data || response.data;
          showAlert('Success ✅', `${txData.plan_name || selectedPlan.label} purchased successfully for ₦${txData?.amount || selectedPlan.amount}\nPhone: ${txData.mobile_number || phoneNumber}`);
          setSelectedNetwork('');
          setPhoneNumber('');
          setSelectedPlanId('');
          setPlans([]);
          fetchWalletBalance();
        } catch (error) {
          showAlert('Failed ❌', error.response?.data?.message || error.message || 'Failed to purchase data.');
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

      {/* Network Selection */}
      <Text style={styles.stepLabel}>1. Select Network</Text>
      <NetworkSelector selected={selectedNetwork} onSelect={(id) => { setSelectedNetwork(id); setSelectedPlanId(''); }} />

      {/* Phone Number */}
      <Text style={styles.stepLabel}>2. Phone Number</Text>
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        icon="call-outline"
        style={{ marginBottom: 0 }}
      />

      {/* Plan Selection */}
      {selectedNetwork && (
        <>
          <Text style={styles.stepLabel}>3. Select Plan</Text>
          <View style={styles.pickerContainer}>
            {plansLoading ? (
              <Text style={styles.loadingText}>Loading plans...</Text>
            ) : plans.length > 0 ? (
              <ScrollView style={styles.plansList} nestedScrollEnabled>
                {plans.map((plan, idx) => (
                  <Button
                    key={`${plan.plan_code}-${idx}`}
                    title={`${plan.label} — ₦${plan.amount.toLocaleString()} (${formatValidity(plan.validity)})`}
                    variant={selectedPlanId === plan.plan_code ? 'primary' : 'secondary'}
                    onPress={() => setSelectedPlanId(plan.plan_code)}
                    style={styles.planBtn}
                    textStyle={styles.planBtnText}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.loadingText}>No plans available</Text>
            )}
          </View>
        </>
      )}

      {/* Price Summary */}
      {selectedPlanDetails && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{selectedPlanDetails.label}</Text>
            <Text style={styles.summaryValue}>₦{selectedPlanDetails.amount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Validity</Text>
            <Text style={styles.summaryValue}>{formatValidity(selectedPlanDetails.validity)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total Debit</Text>
            <Text style={styles.totalValue}>₦{selectedPlanDetails.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>
      )}

      <Button
        title={loading ? 'Processing...' : 'Purchase Data'}
        onPress={handlePurchase}
        loading={loading}
        disabled={!selectedPlanId || !phoneNumber || loading}
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
  pickerContainer: { marginBottom: 4 },
  plansList: { maxHeight: 200 },
  planBtn: { marginBottom: 8, paddingVertical: 12, paddingHorizontal: 14 },
  planBtnText: { fontSize: 13, fontWeight: '600' },
  loadingText: { textAlign: 'center', color: '#94A3B8', paddingVertical: 20, fontSize: 14 },
  summary: { backgroundColor: '#EFF6FF', borderLeftWidth: 4, borderLeftColor: '#2563EB', borderRadius: 12, padding: 16, marginTop: 16, gap: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#0F172A', fontWeight: '700' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#BFDBFE', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 15, color: '#2563EB', fontWeight: '700' },
  totalValue: { fontSize: 16, color: '#2563EB', fontWeight: '800' },
  purchaseBtn: { marginTop: 24 },
});
