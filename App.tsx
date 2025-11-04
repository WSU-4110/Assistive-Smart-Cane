import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardScreen } from './screens/DashboardScreen';
import { ScanScreen } from './screens/ScanScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scan'>('home');

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});