import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Linking } from 'react-native';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl, API_CONFIG } from '../../../config/api';
import { useAppContext } from '../../../context/AppContext';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function ReferralsScreen() {
  const { userData } = useAppContext();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (userData) {
      const code = userData.referralCode || userData.phone || userData.username || 'SMDATA';
      setReferralCode(code);
      setReferralLink(`https://smdata.com.ng/signup?ref=${code}`);
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = userData?._id || userData?.id;
      if (!userId) return;

      setLoading(true);
      try {
        const [commRes, usersRes] = await Promise.all([
          axios.get(apiUrl(API_CONFIG.ENDPOINTS.REFERRALS.COMMISSIONS + userId)).catch(() => null),
          axios.get(apiUrl(API_CONFIG.ENDPOINTS.REFERRALS.REFERRED_USERS + userId)).catch(() => null),
        ]);
        if (commRes?.data?.data) {
          setCommissions(commRes.data.data.transactions || []);
          setTotalEarnings(commRes.data.data.summary?.totalEarnings ?? 0);
        }
        if (usersRes?.data?.data) {
          setReferredUsers(usersRes.data.data.referredUsers || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData]);

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopiedCode(true);
    Toast.show({ type: 'success', text1: 'Referral code copied!' });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    setCopiedLink(true);
    Toast.show({ type: 'success', text1: 'Referral link copied!' });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareReferral = async () => {
    try {
      await Share.share({
        message: `Join SM DATA and enjoy affordable data, airtime, and more! Use my referral code: ${referralCode}\n\nSign up here: ${referralLink}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Join SM DATA! Use my code: ${referralCode}\n${referralLink}`);
    Linking.openURL(`whatsapp://send?text=${msg}`).catch(() => {
      Toast.show({ type: 'error', text1: 'WhatsApp not installed' });
    });
  };

  if (loading) return <LoadingSpinner message="Loading referral data..." />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.statValue, { color: '#16A34A' }]}>₦{totalEarnings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>{referredUsers.length}</Text>
          <Text style={styles.statLabel}>Friends Referred</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Your Referral Code</Text>
        <View style={styles.codeRow}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyCode}>
            <Ionicons name={copiedCode ? 'checkmark' : 'copy-outline'} size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <Text style={styles.codeLabel}>Your Referral Link</Text>
        <View style={styles.codeRow}>
          <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyLink}>
            <Ionicons name={copiedLink ? 'checkmark' : 'copy-outline'} size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Buttons */}
      <View style={styles.shareRow}>
        <TouchableOpacity style={styles.shareBtn} onPress={shareReferral}>
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.shareBtn, styles.whatsappBtn]} onPress={shareWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Referred Users */}
      <Text style={styles.sectionTitle}>Referred Users</Text>
      <View style={styles.listCard}>
        {referredUsers.length > 0 ? (
          referredUsers.map((user, idx) => (
            <View key={idx} style={[styles.userRow, idx < referredUsers.length - 1 && styles.userRowBorder]}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{(user.fullName || 'U').charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.fullName || 'User'}</Text>
                <Text style={styles.userDate}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState icon="people-outline" title="No referrals yet" message="Share your code to start earning" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 16, padding: 18, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 4 },
  codeCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  codeLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  codeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  codeText: { flex: 1, fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: 2 },
  linkText: { flex: 1, fontSize: 12, color: '#64748B' },
  copyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  shareRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12 },
  whatsappBtn: { backgroundColor: '#25D366' },
  shareBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  userRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userAvatarText: { fontSize: 16, fontWeight: '700', color: '#2563EB' },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  userDate: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
});
