import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { apiUrl, API_CONFIG } from '../config/api';
import { getUser, saveUser, removeUser } from '../utils/storage';
import { router } from 'expo-router';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const isLoggedIn = !!userData;

  const fetchUserData = useCallback(async () => {
    try {
      const user = await getUser();
      if (user) {
        setUserData(user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const fetchWalletBalance = useCallback(async () => {
    if (!userData) return;
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    try {
      setWalletLoading(true);
      const response = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.ACCOUNT.walletBalance + 'balance/' + userId)
      );
      setWalletBalance(response.data?.wallet?.balance ?? 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setWalletLoading(false);
    }
  }, [userData]);

  const fetchNotifications = useCallback(async () => {
    if (!userData) return;
    const userId = userData?.id || userData?._id;
    if (!userId) return;

    try {
      const response = await axios.get(
        apiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET + userId)
      );
      setNotifications(
        response.data?.data || response.data?.notifications || response.data || []
      );
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userData]);

  const logout = useCallback(async () => {
    await removeUser();
    setUserData(null);
    setWalletBalance(0);
    setNotifications([]);
    router.replace('/(auth)/login');
  }, []);

  const loginUser = useCallback(async (data) => {
    await saveUser(data);
    setUserData(data);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData) {
      fetchWalletBalance();
      fetchNotifications();
    }
  }, [userData, fetchWalletBalance, fetchNotifications]);

  const value = {
    userData,
    isLoggedIn,
    authLoading,
    walletBalance,
    walletLoading,
    notifications,
    fetchUserData,
    fetchWalletBalance,
    fetchNotifications,
    loginUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
