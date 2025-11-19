import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { UserProfileService } from '../services/UserProfileService';
import { colors } from '../constants/colors';
import { SignUpFormData } from '../types/auth';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin }) => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create the user account with email and password
      const firebaseUser = await signUp({
        email: formData.email,
        password: formData.password,
      });
      
      // Save user profile data to Firestore
      await UserProfileService.createUserProfile(firebaseUser.uid, formData);
      
      // Show success message
      Alert.alert(
        'Account Created',
        'Your account has been created successfully!',
        [{ text: 'OK' }]
      );
      
      // Navigation will be handled by App.tsx based on auth state
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      Alert.alert('Sign Up Error', errorMessage);
    }
  };

  const updateField = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderInput = (
    label: string,
    field: keyof SignUpFormData,
    icon: string,
    options?: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
      secureTextEntry?: boolean;
      showPasswordToggle?: boolean;
    }
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <MaterialIcons
          name={icon as any}
          size={20}
          color={errors[field] ? colors.dangerRed : colors.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={`Enter your ${label.toLowerCase()}`}
          placeholderTextColor={colors.textSecondary}
          value={formData[field]}
          onChangeText={(value) => updateField(field, value)}
          keyboardType={options?.keyboardType || 'default'}
          secureTextEntry={options?.secureTextEntry && !showPassword}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          autoCorrect={false}
          editable={!loading}
        />
        {options?.showPasswordToggle && (
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
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialIcons name="person-add" size={64} color={colors.primaryBlue} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            {/* Personal Information Section */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            {renderInput('First Name', 'firstName', 'person')}
            {renderInput('Last Name', 'lastName', 'person')}
            {renderInput('Phone Number', 'phone', 'phone', { keyboardType: 'phone-pad' })}
            {renderInput('Email', 'email', 'email', { keyboardType: 'email-address' })}
            {renderInput('Password', 'password', 'lock', { 
              secureTextEntry: true, 
              showPasswordToggle: true 
            })}

            {/* Emergency Contact Section */}
            <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>Emergency Contact</Text>
            
            {renderInput('Emergency Contact Name', 'emergencyContactName', 'contact-phone')}
            {renderInput('Emergency Contact Phone', 'emergencyContactPhone', 'phone', { 
              keyboardType: 'phone-pad' 
            })}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin} disabled={loading}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleMargin: {
    marginTop: 24,
  },
  inputContainer: {
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
  button: {
    backgroundColor: colors.primaryBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
});

