import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, SignUpFormData, EmergencyContact } from '../types/auth';

/**
 * User Profile Service
 * Handles saving and retrieving user profile data from Firestore
 */
export class UserProfileService {
  private static readonly COLLECTION_NAME = 'users';

  /**
   * Create a new user profile in Firestore
   * @param uid - User ID from Firebase Auth
   * @param formData - Sign up form data
   * @returns Promise resolving to the created UserProfile
   * @throws Error if profile creation fails
   */
  static async createUserProfile(
    uid: string,
    formData: SignUpFormData
  ): Promise<UserProfile> {
    try {
      const emergencyContact: EmergencyContact = {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
      };

      const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
        uid,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        emergencyContact,
      };

      const now = new Date().toISOString();
      const profileWithTimestamps: UserProfile = {
        ...userProfile,
        createdAt: now,
        updatedAt: now,
      };

      const userRef = doc(db, this.COLLECTION_NAME, uid);
      await setDoc(userRef, {
        ...profileWithTimestamps,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return profileWithTimestamps;
    } catch (error) {
      const firestoreError = error as FirestoreError;
      throw this.handleFirestoreError(firestoreError);
    }
  }

  /**
   * Get user profile from Firestore
   * @param uid - User ID from Firebase Auth
   * @returns Promise resolving to UserProfile or null if not found
   * @throws Error if retrieval fails
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data();
      
      // Convert Firestore timestamps to ISO strings
      const profile: UserProfile = {
        uid: data.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        emergencyContact: data.emergencyContact,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      };

      return profile;
    } catch (error) {
      const firestoreError = error as FirestoreError;
      throw this.handleFirestoreError(firestoreError);
    }
  }

  /**
   * Update user profile in Firestore
   * @param uid - User ID from Firebase Auth
   * @param updates - Partial user profile data to update
   * @returns Promise resolving when update is complete
   * @throws Error if update fails
   */
  static async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // If emergency contact is being updated, ensure it's properly structured
      if (updates.emergencyContact) {
        updateData.emergencyContact = updates.emergencyContact;
      }

      await updateDoc(userRef, updateData);
    } catch (error) {
      const firestoreError = error as FirestoreError;
      throw this.handleFirestoreError(firestoreError);
    }
  }

  /**
   * Check if user profile exists
   * @param uid - User ID from Firebase Auth
   * @returns Promise resolving to true if profile exists, false otherwise
   */
  static async profileExists(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle Firestore errors and convert to user-friendly messages
   * @param error - FirestoreError
   * @returns Error with user-friendly message
   */
  private static handleFirestoreError(error: FirestoreError): Error {
    let message = 'An error occurred while saving your profile. Please try again.';

    switch (error.code) {
      case 'permission-denied':
        message = 'You do not have permission to perform this action.';
        break;
      case 'not-found':
        message = 'Profile not found.';
        break;
      case 'already-exists':
        message = 'Profile already exists.';
        break;
      case 'unavailable':
        message = 'Service is temporarily unavailable. Please try again later.';
        break;
      case 'deadline-exceeded':
        message = 'Request timed out. Please check your connection and try again.';
        break;
      case 'unauthenticated':
        message = 'You must be signed in to perform this action.';
        break;
      default:
        message = error.message || message;
    }

    const userError = new Error(message);
    userError.name = error.code;
    return userError;
  }
}

