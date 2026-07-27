import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { apiUrl, API_CONFIG } from '../../../config/api';
import { useAppContext } from '../../../context/AppContext';
import { saveUser } from '../../../utils/storage';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function EditProfileScreen() {
  const { userData, fetchUserData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (userData) {
      setProfile({
        firstName: userData.firstName || userData.fullName?.split(' ')[0] || '',
        lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    }
  }, [userData]);

  const updateField = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl(API_CONFIG.ENDPOINTS.PROFILE.UPDATE_USER)}/${userId}`,
        profile
      );
      if (response.data) {
        const updatedUser = { ...userData, ...profile };
        await saveUser(updatedUser);
        await fetchUserData();
        Toast.show({ type: 'success', text1: 'Profile updated successfully!' });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.response?.data?.error || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Input label="First Name" value={profile.firstName} onChangeText={(v) => updateField('firstName', v)} placeholder="First name" icon="person-outline" />
        <Input label="Last Name" value={profile.lastName} onChangeText={(v) => updateField('lastName', v)} placeholder="Last name" icon="person-outline" />
        <Input label="Email" value={profile.email} editable={false} icon="mail-outline" />
        <Input label="Phone Number" value={profile.phone} onChangeText={(v) => updateField('phone', v)} placeholder="Phone number" keyboardType="phone-pad" icon="call-outline" />
        <Input label="Address" value={profile.address} onChangeText={(v) => updateField('address', v)} placeholder="Your address" icon="location-outline" multiline />

        <Button title={loading ? 'Saving...' : 'Save Changes'} onPress={handleSave} loading={loading} style={styles.saveBtn} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  saveBtn: { marginTop: 8 },
});
