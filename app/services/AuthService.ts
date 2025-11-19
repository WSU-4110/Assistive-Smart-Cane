import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthUser, LoginFormData, SignUpFormData } from '../types/auth';

/**
 * Authentication Service
 * Wraps Firebase Authentication calls with proper error handling
 */
export class AuthService {
  /**
   * Sign up a new user with email and password
   * @param formData - Sign up form data containing email and password
   * @returns Promise resolving to the created Firebase user
   * @throws Error if sign up fails
   */
  static async signUp(formData: Pick<SignUpFormData, 'email' | 'password'>): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Sign in an existing user with email and password
   * @param formData - Login form data containing email and password
   * @returns Promise resolving to the signed-in Firebase user
   * @throws Error if sign in fails
   */
  static async signIn(formData: LoginFormData): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Sign out the current user
   * @returns Promise that resolves when sign out is complete
   * @throws Error if sign out fails
   */
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw this.handleAuthError(authError);
    }
  }

  /**
   * Get the current authenticated user
   * @returns The current Firebase user, or null if not authenticated
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Subscribe to authentication state changes
   * @param callback - Function called whenever auth state changes
   * @returns Unsubscribe function
   */
  static onAuthStateChanged(
    callback: (user: FirebaseUser | null) => void
  ): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase user to AuthUser type
   * @param firebaseUser - Firebase user object
   * @returns AuthUser object
   */
  static convertToAuthUser(firebaseUser: FirebaseUser | null): AuthUser | null {
    if (!firebaseUser) {
      return null;
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  /**
   * Handle Firebase authentication errors and convert to user-friendly messages
   * @param error - Firebase AuthError
   * @returns Error with user-friendly message
   */
  private static handleAuthError(error: AuthError): Error {
    let message = 'An authentication error occurred. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please sign in instead.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address. Please check and try again.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password authentication is not enabled. Please contact support.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please use a stronger password.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email. Please sign up first.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection and try again.';
        break;
      default:
        message = error.message || message;
    }

    const userError = new Error(message);
    userError.name = error.code;
    return userError;
  }
}

