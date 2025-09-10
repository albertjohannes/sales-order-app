// API Configuration
export const API_CONFIG = {
  // Development URL
  DEV_URL: 'http://localhost:4000/api',
  
  // Production URL (replace with your actual Vercel URL)
  PROD_URL: 'https://your-app-name.vercel.app/api',
  
  // Get current API URL based on environment
  getCurrentUrl: () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // Default to development for now
    return 'http://localhost:4000/api';
  }
};
