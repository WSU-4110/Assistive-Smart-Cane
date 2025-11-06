import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface Device {
  id: string;
  name: string;
  signal: number;
  connected: boolean;
}

export const ScanScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);

  const mockDevices: Device[] = [
    { id: '1', name: 'Smart Cane v2.1', signal: 85, connected: false },
    { id: '2', name: 'Assistant Cane Pro', signal: 72, connected: false },
    { id: '3', name: 'SmartCane-ABC123', signal: 68, connected: false },
    { id: '4', name: 'Cane Device 001', signal: 45, connected: false },
  ];

  const startScan = () => {
    setScanning(true);
    setDevices([]);
    
    setTimeout(() => {
      setDevices(mockDevices);
      setScanning(false);
    }, 2000);
  };

  const connectToDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: !device.connected }
        : { ...device, connected: false }
    ));
  };

  useEffect(() => {
    startScan();
  }, []);

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity 
      style={styles.deviceCard}
      onPress={() => connectToDevice(item.id)}
    >
      <View style={styles.deviceInfo}>
        <MaterialIcons 
          name="bluetooth" 
          size={24} 
          color={item.connected ? colors.primaryBlue : colors.textSecondary} 
        />
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <View style={styles.signalContainer}>
            <MaterialIcons 
              name="signal-cellular-alt" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.signalText}>{item.signal}%</Text>
          </View>
        </View>
      </View>
      <View style={[
        styles.connectionStatus, 
        { backgroundColor: item.connected ? colors.primaryBlue : colors.cardBorder }
      ]}>
        <Text style={[
          styles.statusText,
          { color: item.connected ? colors.white : colors.textSecondary }
        ]}>
          {item.connected ? 'Connected' : 'Connect'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Devices</Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={startScan}
          disabled={scanning}
        >
          <MaterialIcons 
            name="refresh" 
            size={20} 
            color={scanning ? colors.textSecondary : colors.primaryBlue} 
          />
          <Text style={[
            styles.scanText,
            { color: scanning ? colors.textSecondary : colors.primaryBlue }
          ]}>
            {scanning ? 'Scanning...' : 'Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      {scanning ? (
        <View style={styles.scanningContainer}>
          <MaterialIcons 
            name="bluetooth-searching" 
            size={48} 
            color={colors.primaryBlue} 
          />
          <Text style={styles.scanningText}>Searching for devices...</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.deviceList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  scanText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  deviceList: {
    paddingBottom: 20,
  },
  deviceCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  connectionStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});