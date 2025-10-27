import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const EmergencyButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleEmergencyCall = () => {
    Alert.alert('Emergency Call', 'Emergency services have been contacted!');
  };

  const startCountdown = () => {
    setIsPressed(true);
    setIsCountingDown(true);
    setCountdown(3);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsCountingDown(false);
          setIsPressed(false);
          handleEmergencyCall();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsCountingDown(false);
    setIsPressed(false);
    setCountdown(3);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getButtonText = () => {
    if (isCountingDown) {
      return `Hold to call (${countdown}...)`;
    }
    return 'Tap to call for help';
  };

  return (
    <TouchableOpacity
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPressIn={startCountdown}
      onPressOut={stopCountdown}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <Ionicons 
          name="call" 
          size={32} 
          color="white" 
        />
        <Text style={styles.buttonText}>
          {getButtonText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.dangerRed,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    backgroundColor: '#D63447',
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});