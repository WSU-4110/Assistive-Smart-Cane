import { AuthService } from '../AuthService';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { User as FirebaseUser } from 'firebase/auth';

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('../../config/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('AuthService', () => {
  // Mock Firebase user
  const mockFirebaseUser: Partial<FirebaseUser> = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    emailVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as any).currentUser = null;
  });

  describe('signUp', () => {
    it('should successfully create a new user with valid email and password', async () => {
      const formData = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockUserCredential = {
        user: mockFirebaseUser as FirebaseUser,
      };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await AuthService.signUp(formData);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        formData.email,
        formData.password
      );
      expect(result).toEqual(mockFirebaseUser);
    });

    it('should throw error when email is already in use', async () => {
      const formData = {
        email: 'existing@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow(
        'This email is already registered. Please sign in instead.'
      );
    });

    it('should throw error when email format is invalid', async () => {
      const formData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const authError = {
        code: 'auth/invalid-email',
        message: 'Invalid email',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow(
        'Invalid email address. Please check and try again.'
      );
    });

    it('should throw error when password is too weak', async () => {
      const formData = {
        email: 'user@example.com',
        password: '123',
      };

      const authError = {
        code: 'auth/weak-password',
        message: 'Password too weak',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow(
        'Password is too weak. Please use a stronger password.'
      );
    });

    it('should throw error on network failure', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/network-request-failed',
        message: 'Network error',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow(
        'Network error. Please check your connection and try again.'
      );
    });

    it('should handle unknown error codes with default message', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/unknown-error',
        message: 'Something went wrong',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user with valid credentials', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUserCredential = {
        user: mockFirebaseUser as FirebaseUser,
      };

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await AuthService.signIn(formData);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        formData.email,
        formData.password
      );
      expect(result).toEqual(mockFirebaseUser);
    });

    it('should throw error when user is not found', async () => {
      const formData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/user-not-found',
        message: 'User not found',
      };

      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signIn(formData)).rejects.toThrow(
        'No account found with this email. Please sign up first.'
      );
    });

    it('should throw error when password is incorrect', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      const authError = {
        code: 'auth/wrong-password',
        message: 'Wrong password',
      };

      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signIn(formData)).rejects.toThrow(
        'Incorrect password. Please try again.'
      );
    });

    it('should throw error when credentials are invalid', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      const authError = {
        code: 'auth/invalid-credential',
        message: 'Invalid credential',
      };

      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signIn(formData)).rejects.toThrow(
        'Invalid email or password. Please try again.'
      );
    });

    it('should throw error when user account is disabled', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/user-disabled',
        message: 'User disabled',
      };

      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signIn(formData)).rejects.toThrow(
        'This account has been disabled. Please contact support.'
      );
    });

    it('should throw error on too many failed attempts', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      const authError = {
        code: 'auth/too-many-requests',
        message: 'Too many requests',
      };

      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signIn(formData)).rejects.toThrow(
        'Too many failed attempts. Please try again later.'
      );
    });
  });

  describe('handleAuthError', () => {
    // Testing handleAuthError indirectly through signUp/signIn, but we can also test edge cases
    it('should handle auth/operation-not-allowed error', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/operation-not-allowed',
        message: 'Operation not allowed',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow(
        'Email/password authentication is not enabled. Please contact support.'
      );
    });

    it('should use error message when provided for unknown codes', async () => {
      const formData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const authError = {
        code: 'auth/custom-error',
        message: 'Custom error message',
      };

      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signUp(formData)).rejects.toThrow('Custom error message');
    });
  });

  describe('convertToAuthUser', () => {
    it('should convert valid Firebase user to AuthUser', () => {
      const firebaseUser = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        emailVerified: true,
      } as FirebaseUser;

      const result = AuthService.convertToAuthUser(firebaseUser);

      expect(result).toEqual({
        uid: 'test-uid-123',
        email: 'test@example.com',
        emailVerified: true,
      });
    });

    it('should return null when Firebase user is null', () => {
      const result = AuthService.convertToAuthUser(null);

      expect(result).toBeNull();
    });

    it('should handle Firebase user with null email', () => {
      const firebaseUser = {
        uid: 'test-uid-123',
        email: null,
        emailVerified: false,
      } as FirebaseUser;

      const result = AuthService.convertToAuthUser(firebaseUser);

      expect(result).toEqual({
        uid: 'test-uid-123',
        email: null,
        emailVerified: false,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current authenticated user', () => {
      (auth as any).currentUser = mockFirebaseUser as FirebaseUser;

      const result = AuthService.getCurrentUser();

      expect(result).toEqual(mockFirebaseUser);
    });

    it('should return null when no user is authenticated', () => {
      (auth as any).currentUser = null;

      const result = AuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);

      await AuthService.signOut();

      expect(firebaseSignOut).toHaveBeenCalledWith(auth);
    });

    it('should throw error when sign out fails', async () => {
      const authError = {
        code: 'auth/network-request-failed',
        message: 'Network error',
      };

      (firebaseSignOut as jest.Mock).mockRejectedValue(authError);

      await expect(AuthService.signOut()).rejects.toThrow();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should subscribe to auth state changes', () => {
      const callback = jest.fn();
      const unsubscribe = jest.fn();

      (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);

      const result = AuthService.onAuthStateChanged(callback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(auth, callback);
      expect(result).toBe(unsubscribe);
    });
  });
});

