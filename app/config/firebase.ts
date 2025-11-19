import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwOZnBleT4treaxlATbd_w7IeekU7gGDs",
  authDomain: "assistive-smart-cane.firebaseapp.com",
  projectId: "assistive-smart-cane",
  storageBucket: "assistive-smart-cane.firebasestorage.app",
  messagingSenderId: "335835149086",
  appId: "1:335835149086:web:06503565a6d60c964dcf0f",
  measurementId: "G-43W9KYLBBZ"
};

// Initialize Firebase App (only if not already initialized)
let app: FirebaseApp;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  // If initialization fails, try to get existing app
  app = getApps()[0];
  if (!app) {
    throw new Error('Failed to initialize Firebase app');
  }
}

// Initialize Firebase Auth with React Native persistence
let auth: Auth;
try {
  // Try to get getReactNativePersistence from firebase/auth
  const firebaseAuth = require('firebase/auth');
  const getReactNativePersistence = firebaseAuth.getReactNativePersistence;
  
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
    // Fallback: use getAuth if initializeAuth fails
    console.warn('Firebase Auth: Could not initialize with persistence, using default:', error.message);
    auth = getAuth(app);
  }
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { app, auth, db };

