/**
 * Emergency contact information
 */
export interface EmergencyContact {
  name: string;
  phone: string;
}

/**
 * User profile data stored in Firestore
 */
export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Sign up form data
 */
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Firebase Auth user with additional profile data
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  profile?: UserProfile; // Optional, loaded separately from Firestore
}

