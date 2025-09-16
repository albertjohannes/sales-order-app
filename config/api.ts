// API Configuration
export const API_CONFIG = {
  // Development URL
  DEV_URL: 'http://10.10.0.88:4000/api',
  
  // Production URL (replace with your actual Vercel URL)
  PROD_URL: 'https://sales-order-backend.vercel.app/api',
  
  // Get current API URL based on environment
  getCurrentUrl: () => {
    // 1. Check for environment variable override
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // 2. Check if running in development mode
    if (__DEV__) {
      // In development, use local IP for simulator compatibility
      return 'http://10.10.0.88:4000/api';
    }
    
    // 3. Default to production URL
    return 'https://sales-order-backend.vercel.app/api';
  }
};
