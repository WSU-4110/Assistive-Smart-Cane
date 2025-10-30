import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { DeviceStatus, DeviceStatusObserver } from '../services/DeviceStatusObserver';
import { DeviceStatusManager } from '../services/DeviceStatusManager';

export const ConnectionCard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);

  useEffect(() => {
    const statusManager = DeviceStatusManager.getInstance();
    
    const observer: DeviceStatusObserver = {
      update: (status: DeviceStatus) => {
        setIsConnected(status.isConnected);
        setBatteryLevel(status.batteryLevel);
      }
    };

    statusManager.attach(observer);
    const currentStatus = statusManager.getStatus();
    setIsConnected(currentStatus.isConnected);
    setBatteryLevel(currentStatus.batteryLevel);

    return () => {
      statusManager.detach(observer);
    };
  }, []);

  const handleConnect = () => {
    const statusManager = DeviceStatusManager.getInstance();
    statusManager.updateConnectionStatus(!isConnected);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.header}>
        {isConnected ? 'Connected' : 'Not connected'}
      </Text>
      
      <View style={styles.deviceInfo}>
        <MaterialIcons 
          name="bluetooth" 
          size={32} 
          color={isConnected ? colors.primaryBlue : colors.textSecondary} 
        />
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>Smart Cane</Text>
          <Text style={styles.deviceStatus}>
            {isConnected ? `Connected • ${Math.round(batteryLevel)}% battery` : 'Disconnected'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.connectButton, 
          isConnected ? styles.connectedButton : styles.disconnectedButton
        ]}
        onPress={handleConnect}
      >
        <Text style={[
          styles.buttonText,
          isConnected ? styles.connectedButtonText : styles.disconnectedButtonText
        ]}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  connectButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  connectedButton: {
    backgroundColor: colors.successGreen,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  disconnectedButtonText: {
    color: colors.primaryBlue,
  },
  connectedButtonText: {
    color: colors.white,
  },
});