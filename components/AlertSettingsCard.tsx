import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
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
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Low</Text>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={vibrationIntensity}
              onValueChange={setVibrationIntensity}
              minimumTrackTintColor={colors.primaryPurple}
              maximumTrackTintColor={colors.cardBorder}
              thumbTintColor={colors.primaryPurple}
            />
            <Text style={styles.percentageText}>{Math.round(vibrationIntensity)}%</Text>
          </View>
          <Text style={styles.sliderLabel}>High</Text>
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
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Quiet</Text>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={buzzerVolume}
              onValueChange={setBuzzerVolume}
              minimumTrackTintColor={colors.primaryBlue}
              maximumTrackTintColor={colors.cardBorder}
              thumbTintColor={colors.primaryBlue}
            />
            <Text style={styles.percentageText}>{Math.round(buzzerVolume)}%</Text>
          </View>
          <Text style={styles.sliderLabel}>Loud</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'center',
  },
});