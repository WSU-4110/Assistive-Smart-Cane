import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Your web app's Firebase configuration
// Environment variables can override these values for different environments
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCwOZnBleT4treaxlATbd_w7IeekU7gGDs",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "assistive-smart-cane.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "assistive-smart-cane",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "assistive-smart-cane.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "335835149086",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:335835149086:web:06503565a6d60c964dcf0f",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-43W9KYLBBZ", // For Analytics (optional)
};

// Initialize Firebase App (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with AsyncStorage persistence
// This ensures auth state persists between app sessions
let auth: Auth;

try {
  // Try to initialize auth with AsyncStorage persistence first
  // Access getReactNativePersistence from firebase/auth
  // @ts-ignore - getReactNativePersistence exists at runtime in Firebase v10.14+
  const firebaseAuth = require('firebase/auth');
  const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
  
  if (getReactNativePersistence && typeof getReactNativePersistence === 'function') {
    // Initialize with AsyncStorage persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    // Fallback: initialize without persistence if function doesn't exist
    auth = initializeAuth(app);
  }
} catch (error: any) {
  // If auth is already initialized (e.g., during hot reload), get the existing instance
  if (error.code === 'auth/already-initialized' || error.message?.includes('already been initialized')) {
    auth = getAuth(app);
  } else {
    // For any other error, try to get existing auth
    auth = getAuth(app);
    console.warn('Firebase Auth: Could not initialize with AsyncStorage persistence:', error.message);
  }
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { app, auth, db };

