import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const USER_KEY = 'sm_data_user';

export const saveUser = async (data) => {
  try {
    const jsonString = JSON.stringify(data);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(USER_KEY, jsonString);
      }
    } else {
      await SecureStore.setItemAsync(USER_KEY, jsonString);
    }
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    let jsonString = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        jsonString = window.localStorage.getItem(USER_KEY);
      }
    } else {
      jsonString = await SecureStore.getItemAsync(USER_KEY);
    }
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(USER_KEY);
      }
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

export const isAuthenticated = async () => {
  const user = await getUser();
  return !!user;
};

