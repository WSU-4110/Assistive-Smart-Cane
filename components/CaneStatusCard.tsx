import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const CaneStatusCard: React.FC = () => {
  const batteryLevel = 85;
  const signalStrength = 4;
  const temperature = 22;

  const renderSignalBars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.signalBar,
          {
            height: 8 + (index * 4),
            backgroundColor: index < signalStrength ? colors.primaryBlue : colors.cardBorder,
          },
        ]}
      />
    ));
  };

  const renderProgressBar = (percentage: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: percentage > 20 ? colors.successGreen : colors.dangerRed,
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cane Status</Text>
      
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <MaterialIcons 
            name="battery-std" 
            size={20} 
            color={batteryLevel > 20 ? colors.successGreen : colors.dangerRed} 
          />
          <Text style={styles.statusLabel}>Battery</Text>
        </View>
        {renderProgressBar(batteryLevel)}
        <Text style={styles.percentageText}>{batteryLevel}%</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <MaterialIcons 
            name="signal-cellular-alt" 
            size={20} 
            color={colors.primaryBlue} 
          />
          <Text style={styles.statusLabel}>Signal</Text>
        </View>
        <View style={styles.signalContainer}>
          <Text style={styles.signalText}>{signalStrength}/5</Text>
          <View style={styles.signalBars}>
            {renderSignalBars()}
          </View>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <MaterialIcons 
            name="thermostat" 
            size={20} 
            color={colors.primaryPurple} 
          />
          <Text style={styles.statusLabel}>Temperature</Text>
        </View>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperatureText}>{temperature}°C</Text>
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    fontWeight: '500',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.cardBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
  signalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 12,
  },
  signalText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: 8,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    width: 4,
    borderRadius: 1,
  },
  temperatureContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  temperatureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});