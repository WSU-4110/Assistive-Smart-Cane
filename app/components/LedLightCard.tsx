import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const LedLightCard: React.FC = () => {
  const [isLedOn, setIsLedOn] = useState(false);

  const handleToggle = (value: boolean) => {
    setIsLedOn(value);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconAndLabel}>
          <MaterialIcons 
            name="lightbulb" 
            size={24} 
            color="#FFD700" 
          />
          <Text style={styles.title}>LED Light</Text>
        </View>
        <Switch
          trackColor={{ false: colors.textSecondary, true: colors.successGreen }}
          thumbColor={isLedOn ? colors.white : '#f4f3f4'}
          ios_backgroundColor={colors.textSecondary}
          onValueChange={handleToggle}
          value={isLedOn}
        />
      </View>
      
      <Text style={styles.subtitle}>
        LED is {isLedOn ? 'ON' : 'OFF'}
      </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconAndLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});