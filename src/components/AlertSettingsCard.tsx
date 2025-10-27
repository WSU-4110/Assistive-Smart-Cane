import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// Temporarily removed slider component for new architecture compatibility
import { colors } from '../constants/colors';

export const AlertSettingsCard: React.FC = () => {
  const [vibrationIntensity, setVibrationIntensity] = useState(50);
  const [buzzerVolume, setBuzzerVolume] = useState(75);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Alert Settings</Text>
      
      <View style={styles.settingSection}>
        <View style={styles.settingHeader}>
          <MaterialIcons 
            name="vibration" 
            size={24} 
            color={colors.primaryPurple} 
          />
          <Text style={styles.settingTitle}>Vibration Intensity</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{Math.round(vibrationIntensity)}%</Text>
          <Text style={styles.valueLabel}>Current setting</Text>
        </View>
      </View>

      <View style={styles.settingSection}>
        <View style={styles.settingHeader}>
          <Ionicons 
            name="volume-medium" 
            size={24} 
            color={colors.primaryBlue} 
          />
          <Text style={styles.settingTitle}>Buzzer Volume</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{Math.round(buzzerVolume)}%</Text>
          <Text style={styles.valueLabel}>Current setting</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  valueContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  valueText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  valueLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});