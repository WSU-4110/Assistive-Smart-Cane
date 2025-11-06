import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface NavigationProps {
  activeTab: 'home' | 'scan';
  onTabPress: (tab: 'home' | 'scan') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.navigation}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'home' && styles.activeTab]}
        onPress={() => onTabPress('home')}
      >
        <MaterialIcons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? colors.primaryBlue : colors.textSecondary} 
        />
        <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
        onPress={() => onTabPress('scan')}
      >
        <MaterialIcons 
          name="bluetooth-searching" 
          size={24} 
          color={activeTab === 'scan' ? colors.primaryBlue : colors.textSecondary} 
        />
        <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>
          Scan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryBlue,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primaryBlue,
    fontWeight: '600',
  },
});