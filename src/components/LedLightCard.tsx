import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const LedLightCard: React.FC = () => {
  const [isLedOn, setIsLedOn] = useState(false);

  const toggleLed = () => {
    setIsLedOn(!isLedOn);
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Ionicons 
            name="bulb" 
            size={32} 
            color="#FFD700" 
          />
          <View style={styles.textContent}>
            <Text style={styles.title}>LED Light</Text>
            <Text style={styles.subtitle}>
              LED is {isLedOn ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
        <Switch
          value={isLedOn}
          onValueChange={toggleLed}
          trackColor={{ false: colors.textSecondary, true: colors.successGreen }}
          thumbColor={'white'}
        />
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContent: {
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});