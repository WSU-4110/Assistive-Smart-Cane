import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const ConnectionCard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusLabel}>
        {isConnected ? 'Connected' : 'Not connected'}
      </Text>
      <View style={styles.card}>
        <View style={styles.content}>
          <Ionicons 
            name="bluetooth" 
            size={32} 
            color={isConnected ? colors.primaryBlue : colors.textSecondary} 
          />
          <View style={styles.textContent}>
            <Text style={styles.title}>Smart Cane</Text>
            <Text style={styles.subtitle}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.button, isConnected && styles.buttonConnected]} 
          onPress={toggleConnection}
        >
          <Text style={[styles.buttonText, isConnected && styles.buttonTextConnected]}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContent: {
    marginLeft: 16,
    flex: 1,
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
  button: {
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonConnected: {
    backgroundColor: colors.primaryBlue,
  },
  buttonText: {
    color: colors.primaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextConnected: {
    color: 'white',
  },
});