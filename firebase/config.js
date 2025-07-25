import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import crashlytics conditionally for platform compatibility
let crashlytics;
try {
  // Only try to import Crashlytics on native platforms
  const isWeb = typeof document !== 'undefined';
  if (!isWeb) {
    crashlytics = require('@react-native-firebase/crashlytics').default;
  }
} catch (error) {
  console.log('Crashlytics not available on this platform');
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTrz4mnNbfQnF1LwH1WwAwuHUtVh9xmVU",
  authDomain: "todo-app-v1-30773.firebaseapp.com",
  projectId: "todo-app-v1-30773",
  storageBucket: "todo-app-v1-30773.firebasestorage.app",
  messagingSenderId: "373857953694",
  appId: "1:373857953694:web:22ce5eb495d616cc5e188f",
  measurementId: "G-27C8TJHVS9"
}; 

// Initialize Firebase
let app;
try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    console.log('Initializing Firebase app');
    app = initializeApp(firebaseConfig);
  } else {
    console.log('Firebase app already initialized, getting existing app');
    app = getApp();
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

const auth = getAuth(app);
const firestore = getFirestore(app);

// Initialize Crashlytics
const initCrashlytics = () => {
  try {
    // Only initialize if crashlytics is available (not on web)
    if (crashlytics) {
      crashlytics().setCrashlyticsCollectionEnabled(true);
      console.log('Crashlytics initialized successfully');
    } else {
      // On web platform, just log that Crashlytics is not available
      const isWeb = typeof document !== 'undefined';
      if (isWeb) {
        console.log('Crashlytics not available on web platform');
      } else {
        console.log('Crashlytics not initialized - not available on this platform');
      }
    }
  } catch (error) {
    console.error('Failed to initialize Crashlytics:', error);
  }
};

export { app, auth, firestore, initCrashlytics };