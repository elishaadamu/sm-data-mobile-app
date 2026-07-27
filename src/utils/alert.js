import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

export const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    Toast.show({
      type: title.toLowerCase().includes('success') ? 'success' : 'error',
      text1: title,
      text2: message,
    });
  } else {
    Alert.alert(title, message);
  }
};

export const confirmAction = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  }
};
