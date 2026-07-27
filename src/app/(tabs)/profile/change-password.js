import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { apiUrl, API_CONFIG } from '../../../config/api';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function ChangePasswordScreen() {
  const [activeTab, setActiveTab] = useState('change');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await axios.put(apiUrl(API_CONFIG.ENDPOINTS.SECURITY.CHANGE_PASSWORD), { oldPassword, newPassword });
      Toast.show({ type: 'success', text1: 'Password changed successfully' });
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Please enter your email' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(apiUrl(API_CONFIG.ENDPOINTS.SECURITY.RESET_PASSWORD), { email });
      Toast.show({ type: 'success', text1: 'Reset link sent to your email' });
      setEmail('');
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'change' && styles.tabActive]}
          onPress={() => setActiveTab('change')}
        >
          <Text style={[styles.tabText, activeTab === 'change' && styles.tabTextActive]}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reset' && styles.tabActive]}
          onPress={() => setActiveTab('reset')}
        >
          <Text style={[styles.tabText, activeTab === 'reset' && styles.tabTextActive]}>Reset Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {activeTab === 'change' ? (
          <>
            <Input label="Old Password" value={oldPassword} onChangeText={setOldPassword} placeholder="Enter old password" secureTextEntry icon="lock-closed-outline" required />
            <Input label="New Password" value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" secureTextEntry icon="lock-open-outline" required />
            <Button title={loading ? 'Saving...' : 'Change Password'} onPress={handleChangePassword} loading={loading} />
          </>
        ) : (
          <>
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" icon="mail-outline" required />
            <Button title={loading ? 'Sending...' : 'Reset Password'} onPress={handleResetPassword} loading={loading} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  tabRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
});
