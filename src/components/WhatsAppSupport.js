import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

const WHATSAPP_NUMBER = '+2347073775347';
const DISPLAY_NUMBER = '+234 707 377 5347';

export default function WhatsAppSupport() {
  const [modalVisible, setModalVisible] = useState(false);

  const openWhatsApp = async () => {
    setModalVisible(false);
    const message = encodeURIComponent('Hello SM DATA Customer Support, I need assistance.');
    const url = `https://wa.me/2347073775347?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://api.whatsapp.com/send?phone=2347073775347&text=${message}`);
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Toast.show({ type: 'error', text1: 'Could not open WhatsApp', text2: 'Please copy the number to chat.' });
    }
  };

  const makeCall = () => {
    setModalVisible(false);
    Linking.openURL(`tel:${WHATSAPP_NUMBER}`);
  };

  const copyNumber = async () => {
    await Clipboard.setStringAsync(DISPLAY_NUMBER);
    Toast.show({ type: 'success', text1: 'Support Number Copied!', text2: DISPLAY_NUMBER });
    setModalVisible(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="logo-whatsapp" size={28} color="#FFFFFF" />
        <View style={styles.badgeDot} />
      </TouchableOpacity>

      {/* Support Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.whatsappIconBg}>
                <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
              </View>
              <Text style={styles.modalTitle}>24/7 Customer Support</Text>
              <Text style={styles.modalSubtitle}>
                We are always available to help you with your orders and inquiries.
              </Text>
            </View>

            <View style={styles.numberCard}>
              <Text style={styles.numberLabel}>WhatsApp & Phone Support</Text>
              <Text style={styles.numberValue}>{DISPLAY_NUMBER}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.chatBtn} onPress={openWhatsApp} activeOpacity={0.85}>
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                <Text style={styles.chatBtnText}>Chat on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.callBtn} onPress={makeCall} activeOpacity={0.85}>
                <Ionicons name="call-outline" size={18} color="#0F172A" />
                <Text style={styles.callBtnText}>Call Phone Support</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.copyBtn} onPress={copyNumber} activeOpacity={0.85}>
                <Ionicons name="copy-outline" size={18} color="#2563EB" />
                <Text style={styles.copyBtnText}>Copy Phone Number</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#25D366',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  whatsappIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  numberCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  numberLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 12,
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
  },
  callBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 14,
    borderRadius: 12,
  },
  copyBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
});
