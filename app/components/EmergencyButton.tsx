import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export const EmergencyButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [buttonText, setButtonText] = useState('Tap to call for help');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleEmergencyCall = () => {
    console.log('Emergency call initiated!');
    // Placeholder function for emergency call
    alert('Emergency call would be placed here');
    resetButton();
  };

  const resetButton = () => {
    setIsPressed(false);
    setCountdown(3);
    setButtonText('Tap to call for help');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = () => {
    setIsPressed(true);
    setCountdown(3);
    
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleEmergencyCall();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isPressed) {
      setButtonText(`Hold to call (${countdown}...)`);
    }
  }, [isPressed, countdown]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePressIn = () => {
    startCountdown();
  };

  const handlePressOut = () => {
    if (isPressed) {
      resetButton();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPressed && styles.buttonPressed]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <MaterialIcons 
          name="phone" 
          size={32} 
          color={colors.white} 
        />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.dangerRed,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    minHeight: 80,
  },
  buttonPressed: {
    backgroundColor: '#D32F2F',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    textAlign: 'center',
    flex: 1,
  },
});