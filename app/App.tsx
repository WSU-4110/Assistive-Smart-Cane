import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardScreen } from './screens/DashboardScreen';
import { ScanScreen } from './screens/ScanScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { colors } from './constants/colors';

// Main app content that uses auth context
function AppContent() {
  const { user, initializing } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'scan'>('home');
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  // Show loading screen while checking auth state
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  // Show auth screens if user is not authenticated
  if (!user) {
    if (authScreen === 'login') {
      return <LoginScreen onNavigateToSignUp={() => setAuthScreen('signup')} />;
    } else {
      return <SignUpScreen onNavigateToLogin={() => setAuthScreen('login')} />;
    }
  }

  // Show main app if user is authenticated
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'scan':
        return <ScanScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Navigation activeTab={activeTab} onTabPress={setActiveTab} />
      {renderScreen()}
    </View>
  );
}

// Root app component wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});