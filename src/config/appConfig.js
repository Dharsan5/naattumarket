// Main configuration file for environment-specific settings
const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000, // 30 seconds
  },
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || window.location.origin,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    folder: 'naattumarket',
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    expiryKey: 'token_expiry',
  },
  routes: {
    home: '/',
    login: '/login',
    signup: '/signup',
    products: '/products',
    orders: '/orders',
    account: '/account',
    suppliers: '/suppliers',
  },
  features: {
    enableLocationServices: true,
    enableNotifications: true,
    enableOfflineMode: true,
  },
};

export default config;
