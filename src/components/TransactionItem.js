import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionItem = ({ transaction, onPress }) => {
  const isCredit = transaction.type === 'credit';
  const amount = parseFloat(transaction.amount || 0);
  const date = new Date(transaction.createdAt || transaction.date);

  const getIcon = () => {
    const type = (transaction.TransactionType || '').toLowerCase();
    if (type.includes('data')) return 'cellular-outline';
    if (type.includes('airtime')) return 'call-outline';
    if (type.includes('cable')) return 'tv-outline';
    if (type.includes('electric')) return 'flash-outline';
    if (type.includes('waec') || type.includes('neco')) return 'document-text-outline';
    if (isCredit) return 'arrow-down-circle-outline';
    return 'arrow-up-circle-outline';
  };

  const formatDate = (d) => {
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBg, isCredit ? styles.iconCredit : styles.iconDebit]}>
        <Ionicons
          name={getIcon()}
          size={20}
          color={isCredit ? '#16A34A' : '#DC2626'}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.type} numberOfLines={1}>
          {transaction.TransactionType || (isCredit ? 'Credit' : 'Debit')}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || transaction.phoneNumber || '—'}
        </Text>
      </View>
      <View style={styles.amountSection}>
        <Text style={[styles.amount, isCredit ? styles.amountCredit : styles.amountDebit]}>
          {isCredit ? '+' : '-'}₦{amount.toLocaleString()}
        </Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCredit: {
    backgroundColor: '#F0FDF4',
  },
  iconDebit: {
    backgroundColor: '#FEF2F2',
  },
  details: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#94A3B8',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountCredit: {
    color: '#16A34A',
  },
  amountDebit: {
    color: '#DC2626',
  },
  date: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});

export default TransactionItem;
