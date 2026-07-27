import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { apiUrl, API_CONFIG } from '../../config/api';
import { useAppContext } from '../../context/AppContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function SignupScreen() {
  const { loginUser } = useAppContext();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.password) {
      Toast.show({ type: 'error', text1: 'Please fill in all required fields' });
      return;
    }

    if (formData.password.length < 8) {
      Toast.show({ type: 'error', text1: 'Password must be at least 8 characters' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;

      // 1. Register
      await axios.post(apiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP), payload);

      // 2. Auto-login
      const loginResponse = await axios.post(apiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNIN), {
        email: payload.email,
        password: payload.password,
      });

      if (!loginResponse.data) throw new Error('No data received from login');

      // 3. Save user data
      await loginUser(loginResponse.data);

      Toast.show({ type: 'success', text1: 'Account Created!', text2: 'Welcome to SM DATA' });
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.response?.data?.message || 'An error occurred during signup.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SM DATA today</Text>

          <Input
            label="Full Name"
            value={formData.fullName}
            onChangeText={(v) => updateField('fullName', v)}
            placeholder="Enter your full name"
            icon="person-outline"
            required
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(v) => updateField('phone', v)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            icon="call-outline"
            required
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(v) => updateField('email', v)}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon="mail-outline"
            required
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(v) => updateField('password', v)}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            icon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            required
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(v) => updateField('confirmPassword', v)}
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            icon="lock-closed-outline"
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />

          <Input
            label="Referral Code"
            value={formData.referralCode}
            onChangeText={(v) => updateField('referralCode', v)}
            placeholder="Enter referral code (optional)"
            icon="gift-outline"
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            style={styles.signupBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  formSection: {},
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
  },
  signupBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
});
