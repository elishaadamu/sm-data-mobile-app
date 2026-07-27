import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Index() {
  const { isLoggedIn, authLoading } = useAppContext();

  if (authLoading) {
    return <LoadingSpinner message="Starting SM DATA..." />;
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
