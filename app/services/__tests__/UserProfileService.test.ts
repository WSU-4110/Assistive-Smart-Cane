import { UserProfileService } from '../UserProfileService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SignUpFormData } from '../../types/auth';

// Mock Firebase Firestore modules
jest.mock('firebase/firestore');
jest.mock('../../config/firebase', () => ({
  db: {},
}));

describe('UserProfileService', () => {
  const mockUid = 'test-uid-123';
  const mockFormData: SignUpFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    password: 'password123',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '987-654-3210',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (serverTimestamp as jest.Mock).mockReturnValue({ _methodName: 'serverTimestamp' });
  });

  describe('createUserProfile', () => {
    it('should successfully create user profile with valid data', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);

      const result = await UserProfileService.createUserProfile(mockUid, mockFormData);

      expect(doc).toHaveBeenCalledWith(db, 'users', mockUid);
      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          uid: mockUid,
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890',
          email: 'john.doe@example.com',
          emergencyContact: {
            name: 'Jane Doe',
            phone: '987-654-3210',
          },
          createdAt: { _methodName: 'serverTimestamp' },
          updatedAt: { _methodName: 'serverTimestamp' },
        })
      );

      expect(result).toEqual({
        uid: mockUid,
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '987-654-3210',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should trim whitespace from form fields', async () => {
      const formDataWithWhitespace: SignUpFormData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        phone: '  123-456-7890  ',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        password: 'password123',
        emergencyContactName: '  Jane Doe  ',
        emergencyContactPhone: '  987-654-3210  ',
      };

      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);

      await UserProfileService.createUserProfile(mockUid, formDataWithWhitespace);

      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890',
          email: 'john.doe@example.com', // Should be lowercased
          // Note: emergency contact fields are not trimmed in the current implementation
          emergencyContact: {
            name: '  Jane Doe  ',
            phone: '  987-654-3210  ',
          },
        })
      );
    });

    it('should convert email to lowercase', async () => {
      const formDataWithUppercaseEmail: SignUpFormData = {
        ...mockFormData,
        email: 'JOHN.DOE@EXAMPLE.COM',
      };

      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);

      await UserProfileService.createUserProfile(mockUid, formDataWithUppercaseEmail);

      expect(mockSetDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          email: 'john.doe@example.com',
        })
      );
    });

    it('should throw error when Firestore permission is denied', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;
      const firestoreError = {
        code: 'permission-denied',
        message: 'Permission denied',
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(firestoreError);

      await expect(
        UserProfileService.createUserProfile(mockUid, mockFormData)
      ).rejects.toThrow('You do not have permission to perform this action.');
    });

    it('should throw error when Firestore service is unavailable', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;
      const firestoreError = {
        code: 'unavailable',
        message: 'Service unavailable',
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(firestoreError);

      await expect(
        UserProfileService.createUserProfile(mockUid, mockFormData)
      ).rejects.toThrow('Service is temporarily unavailable. Please try again later.');
    });

    it('should throw error when request times out', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;
      const firestoreError = {
        code: 'deadline-exceeded',
        message: 'Deadline exceeded',
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(firestoreError);

      await expect(
        UserProfileService.createUserProfile(mockUid, mockFormData)
      ).rejects.toThrow('Request timed out. Please check your connection and try again.');
    });

    it('should throw error when user is unauthenticated', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;
      const firestoreError = {
        code: 'unauthenticated',
        message: 'Unauthenticated',
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(firestoreError);

      await expect(
        UserProfileService.createUserProfile(mockUid, mockFormData)
      ).rejects.toThrow('You must be signed in to perform this action.');
    });

    it('should handle unknown Firestore errors with default message', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;
      const firestoreError = {
        code: 'unknown-error',
        message: 'Unknown error occurred',
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockRejectedValue(firestoreError);

      await expect(
        UserProfileService.createUserProfile(mockUid, mockFormData)
      ).rejects.toThrow('Unknown error occurred');
    });

    it('should include timestamps in returned profile', async () => {
      const mockDocRef = {};
      const mockSetDoc = setDoc as jest.Mock;

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      mockSetDoc.mockResolvedValue(undefined);

      const result = await UserProfileService.createUserProfile(mockUid, mockFormData);

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(new Date(result.createdAt).getTime()).not.toBeNaN();
      expect(new Date(result.updatedAt).getTime()).not.toBeNaN();
    });
  });
});

