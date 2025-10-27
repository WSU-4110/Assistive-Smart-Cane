import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const CaneStatusCard: React.FC = () => {
  const batteryPercentage = 85;
  const signalStrength = 4;
  const temperature = 22;

  const renderSignalBars = () => {
    const bars = [];
    for (let i = 1; i <= 5; i++) {
      bars.push(
        <View
          key={i}
          style={[
            styles.signalBar,
            { height: i * 3 + 5 },
            i <= signalStrength ? styles.signalBarActive : styles.signalBarInactive
          ]}
        />
      );
    }
    return bars;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cane Status</Text>
      
      <View style={styles.statusItem}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name="battery-half" 
            size={24} 
            color={colors.successGreen} 
          />
          <Text style={styles.statusLabel}>Battery</Text>
        </View>
        <View style={styles.batteryContainer}>
          <View style={styles.batteryBar}>
            <View 
              style={[
                styles.batteryFill,
                { width: `${batteryPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.statusValue}>{batteryPercentage}%</Text>
        </View>
      </View>

      <View style={styles.statusItem}>
        <View style={styles.statusHeader}>
          <MaterialIcons 
            name="signal-cellular-4-bar" 
            size={24} 
            color={colors.primaryBlue} 
          />
          <Text style={styles.statusLabel}>Signal</Text>
        </View>
        <View style={styles.signalContainer}>
          <View style={styles.signalBars}>
            {renderSignalBars()}
          </View>
          <Text style={styles.statusValue}>{signalStrength}/5</Text>
        </View>
      </View>

      <View style={styles.statusItem}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name="thermometer" 
            size={24} 
            color={colors.dangerRed} 
          />
          <Text style={styles.statusLabel}>Temperature</Text>
        </View>
        <Text style={styles.statusValue}>{temperature}°C</Text>
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
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBar: {
    width: 80,
    height: 8,
    backgroundColor: colors.cardBorder,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    backgroundColor: colors.successGreen,
    borderRadius: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 12,
  },
  signalBar: {
    width: 4,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  signalBarActive: {
    backgroundColor: colors.primaryBlue,
  },
  signalBarInactive: {
    backgroundColor: colors.cardBorder,
  },
});