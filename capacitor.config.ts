// capacitor.config.ts (root mein)

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silverscisor.app',
  appName: 'Silverscisor',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f43f5e',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#f43f5e'
    }
  }
};

export default config;