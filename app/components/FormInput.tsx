import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: string;
  error?: string;
  showPasswordToggle?: boolean;
  containerStyle?: object;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  error,
  showPasswordToggle = false,
  containerStyle,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  editable = true,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = secureTextEntry && showPasswordToggle;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <MaterialIcons
          name={icon as any}
          size={20}
          color={error ? colors.dangerRed : colors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          editable={editable}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.dangerRed,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerRed,
    marginTop: 4,
    marginLeft: 4,
  },
});

