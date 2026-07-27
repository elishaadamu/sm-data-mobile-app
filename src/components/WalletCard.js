import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WalletCard = ({ balance = 0, loading = false, accountDetails, onCreateAccount }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.balanceSection}>
          <View style={styles.iconBg}>
            <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            {loading ? (
              <View style={styles.skeleton} />
            ) : (
              <Text style={styles.balanceAmount}>
                ₦{balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.accountSection}>
        <Text style={styles.accountLabel}>Virtual Account</Text>
        {accountDetails?.accountNumber ? (
          <View>
            <Text style={styles.accountNumber}>{accountDetails.accountNumber}</Text>
            <Text style={styles.bankName}>
              {accountDetails.bankName} • {accountDetails.accountName}
            </Text>
            <Text style={styles.feeText}>Fee: 1.5% + ₦50 (capped at ₦5,000)</Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.createBtn} onPress={onCreateAccount} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.createBtnText}>Create Virtual Account</Text>
            </TouchableOpacity>
            <Text style={styles.feeNote}>Deposit Fee: 1.5% + ₦50 (max ₦5,000)</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E40AF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  skeleton: {
    width: 120,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 16,
  },
  accountSection: {},
  accountLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  bankName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 3,
  },
  feeText: {
    fontSize: 10,
    color: '#FDE047',
    fontWeight: '700',
    marginTop: 6,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  feeNote: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
});

export default WalletCard;
