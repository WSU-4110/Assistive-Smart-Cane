import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { ConnectionCard } from '../components/ConnectionCard';
import { LedLightCard } from '../components/LedLightCard';
import { AlertSettingsCard } from '../components/AlertSettingsCard';
import { CaneStatusCard } from '../components/CaneStatusCard';
import { EmergencyButton } from '../components/EmergencyButton';
import { colors } from '../constants/colors';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ConnectionCard />
        <LedLightCard />
        <AlertSettingsCard />
        <CaneStatusCard />
        <EmergencyButton />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
