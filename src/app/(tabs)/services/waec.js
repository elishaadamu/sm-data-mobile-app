import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl, API_CONFIG } from '../../../config/api';
import { useAppContext } from '../../../context/AppContext';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function WaecScreen() {
  const { userData, walletBalance, fetchWalletBalance } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const cardPrice = 3800;
  const totalAmount = useMemo(() => cardPrice * quantity, [quantity]);

  const handlePurchase = () => {
    const userId = userData?.id || userData?._id;
    if (!userId || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Buy ${quantity} WAEC Scratch Card(s) for ₦${totalAmount.toLocaleString()}?\n\nPINs will be sent to: ${phoneNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await axios.post(apiUrl(API_CONFIG.ENDPOINTS.WAEC.BUY_PIN), {
                examType: 'result_checker',
                quantity,
                phoneNumber,
                email,
                amount: totalAmount,
                userId,
              });
              Alert.alert('Success ✅', response.data?.message || 'WAEC Scratch Card purchased successfully!');
              setQuantity(1);
              setPhoneNumber('');
              setEmail('');
              fetchWalletBalance();
            } catch (error) {
              Alert.alert('Failed ❌', error.response?.data?.message || 'Failed to purchase WAEC card.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EDUCATION</Text>
          </View>
          <Text style={styles.heroTitle}>WAEC Scratch Card</Text>
          <Text style={styles.heroSubtitle}>Buy Result Checker PINs instantly</Text>
        </View>
        <Image source={require('../../../../assets/education/waec-logo.jpg')} style={styles.heroImage} />
      </View>

      {/* Wallet */}
      <View style={styles.walletRow}>
        <Ionicons name="wallet" size={20} color="#059669" />
        <Text style={styles.walletLabel}>Balance: </Text>
        <Text style={styles.walletAmount}>₦{walletBalance.toLocaleString()}</Text>
      </View>

      {/* Quantity */}
      <Text style={styles.label}>Quantity</Text>
      <View style={styles.quantityRow}>
        {[1, 2, 3, 4, 5].map((q) => (
          <Button
            key={q}
            title={String(q)}
            variant={quantity === q ? 'primary' : 'secondary'}
            onPress={() => setQuantity(q)}
            style={styles.qtyBtn}
          />
        ))}
      </View>

      {/* Phone */}
      <Input
        label="Phone Number (for PIN delivery)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        icon="call-outline"
        required
      />

      {/* Email */}
      <Input
        label="Email (Optional)"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email address"
        keyboardType="email-address"
        icon="mail-outline"
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cost (₦{cardPrice.toLocaleString()} × {quantity})</Text>
          <Text style={styles.summaryValue}>₦{totalAmount.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Total Debit</Text>
          <Text style={styles.totalValue}>₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <Button
        title={loading ? 'Processing...' : 'Purchase Scratch Card'}
        onPress={handlePurchase}
        loading={loading}
        disabled={!phoneNumber || loading}
        style={styles.purchaseBtn}
      />

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 How to Check Result</Text>
        <Text style={styles.infoText}>1. Visit www.waecdirect.org</Text>
        <Text style={styles.infoText}>2. Enter your Examination Number</Text>
        <Text style={styles.infoText}>3. Enter the Card Serial Number & PIN</Text>
        <Text style={styles.infoText}>4. Click Submit to view your result</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  hero: { backgroundColor: '#1E3A5F', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  heroContent: { flex: 1, marginRight: 12 },
  badge: { backgroundColor: 'rgba(59,130,246,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8 },
  badgeText: { color: '#93C5FD', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  heroImage: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#FFFFFF' },
  walletRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 14, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0' },
  walletLabel: { fontSize: 14, color: '#166534', marginLeft: 8 },
  walletAmount: { fontSize: 18, fontWeight: '800', color: '#166534' },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 10 },
  quantityRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  qtyBtn: { flex: 1, paddingVertical: 12 },
  summary: { backgroundColor: '#EFF6FF', borderLeftWidth: 4, borderLeftColor: '#2563EB', borderRadius: 12, padding: 16, marginTop: 4, gap: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  summaryValue: { fontSize: 14, color: '#0F172A', fontWeight: '700' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#BFDBFE', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 16, color: '#2563EB', fontWeight: '800' },
  totalValue: { fontSize: 18, color: '#2563EB', fontWeight: '800' },
  purchaseBtn: { marginTop: 24 },
  infoCard: { marginTop: 24, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  infoText: { fontSize: 13, color: '#64748B', lineHeight: 22 },
});
