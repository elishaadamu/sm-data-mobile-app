const API_BASE_URL = 'https://smdata.onrender.com/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/register',
      SIGNIN: '/auth/login',
    },
    ACCOUNT: {
      CREATE_VIRTUAL: '/wallet/topup/initiate/',
      walletBalance: '/wallet/',
      ALL_HISTORY: '/transactions/history/',
    },
    PROFILE: {
      GET: '/user/profile',
      UPDATE_USER: '/user/update',
    },
    DATA: {
      GET_ALL: '/data-plan',
      GET_BY_NETWORK: '/data-plan/network/',
      CREATE: '/vtu/data',
    },
    AIRTIME: {
      GET_ALL: '/airtime-plan',
      GET_BY_NETWORK: '/airtime-plan/network',
      CREATE: '/vtu/airtime',
    },
    WAEC: {
      BUY_PIN: '/verify/waec',
    },
    NECO: {
      BUY_PIN: '/verify/neco',
    },
    SECURITY: {
      CHANGE_PASSWORD: '/security/change-password',
      RESET_PASSWORD: '/security/reset-password',
    },
    NOTIFICATIONS: {
      GET: '/notifications/',
    },
    REFERRALS: {
      COMMISSIONS: '/wallet/referral-commissions/',
      REFERRED_USERS: '/wallet/referred-users/',
    },
    TRANSACTIONS: {
      HISTORY: '/transactions/history/',
    },
  },
};

export const apiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
