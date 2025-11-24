/**
 * Unit tests for SignUpScreen validation logic
 * Tests the validateForm function behavior with various inputs
 */

import { SignUpFormData } from '../../types/auth';

// Validation logic extracted from SignUpScreen for testing
const validateSignUpForm = (formData: SignUpFormData): Partial<Record<keyof SignUpFormData, string>> => {
  const errors: Partial<Record<keyof SignUpFormData, string>> = {};

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!formData.emergencyContactName.trim()) {
    errors.emergencyContactName = 'Emergency contact name is required';
  }

  if (!formData.emergencyContactPhone.trim()) {
    errors.emergencyContactPhone = 'Emergency contact phone is required';
  } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.emergencyContactPhone)) {
    errors.emergencyContactPhone = 'Please enter a valid phone number';
  }

  return errors;
};

describe('SignUpScreen - validateForm', () => {
  const validFormData: SignUpFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    password: 'password123',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '987-654-3210',
  };

  describe('valid input', () => {
    it('should return no errors for valid form data', () => {
      const errors = validateSignUpForm(validFormData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should accept phone numbers with various formats', () => {
      const formats = [
        '123-456-7890',
        '(123) 456-7890',
        '1234567890',
        '+1 123-456-7890',
        '123 456 7890',
      ];

      formats.forEach((phone) => {
        const formData = { ...validFormData, phone };
        const errors = validateSignUpForm(formData);
        expect(errors.phone).toBeUndefined();
      });
    });
  });

  describe('invalid input - empty fields', () => {
    it('should return error when first name is empty', () => {
      const formData = { ...validFormData, firstName: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.firstName).toBe('First name is required');
    });

    it('should return error when first name is only whitespace', () => {
      const formData = { ...validFormData, firstName: '   ' };
      const errors = validateSignUpForm(formData);
      expect(errors.firstName).toBe('First name is required');
    });

    it('should return error when last name is empty', () => {
      const formData = { ...validFormData, lastName: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.lastName).toBe('Last name is required');
    });

    it('should return error when phone is empty', () => {
      const formData = { ...validFormData, phone: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBe('Phone number is required');
    });

    it('should return error when email is empty', () => {
      const formData = { ...validFormData, email: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.email).toBe('Email is required');
    });

    it('should return error when password is empty', () => {
      const formData = { ...validFormData, password: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.password).toBe('Password is required');
    });

    it('should return error when emergency contact name is empty', () => {
      const formData = { ...validFormData, emergencyContactName: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.emergencyContactName).toBe('Emergency contact name is required');
    });

    it('should return error when emergency contact phone is empty', () => {
      const formData = { ...validFormData, emergencyContactPhone: '' };
      const errors = validateSignUpForm(formData);
      expect(errors.emergencyContactPhone).toBe('Emergency contact phone is required');
    });
  });

  describe('invalid input - email validation', () => {
    it('should return error for email without @ symbol', () => {
      const formData = { ...validFormData, email: 'invalidemail.com' };
      const errors = validateSignUpForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email without domain', () => {
      const formData = { ...validFormData, email: 'invalid@email' };
      const errors = validateSignUpForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email with spaces', () => {
      const formData = { ...validFormData, email: 'invalid @email.com' };
      const errors = validateSignUpForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@example-domain.com',
      ];

      validEmails.forEach((email) => {
        const formData = { ...validFormData, email };
        const errors = validateSignUpForm(formData);
        expect(errors.email).toBeUndefined();
      });
    });
  });

  describe('invalid input - password validation', () => {
    it('should return error when password is less than 6 characters', () => {
      const formData = { ...validFormData, password: '12345' };
      const errors = validateSignUpForm(formData);
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should return error when password is exactly 5 characters', () => {
      const formData = { ...validFormData, password: '12345' };
      const errors = validateSignUpForm(formData);
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should accept password with exactly 6 characters', () => {
      const formData = { ...validFormData, password: '123456' };
      const errors = validateSignUpForm(formData);
      expect(errors.password).toBeUndefined();
    });

    it('should accept password with more than 6 characters', () => {
      const formData = { ...validFormData, password: 'verylongpassword123' };
      const errors = validateSignUpForm(formData);
      expect(errors.password).toBeUndefined();
    });
  });

  describe('invalid input - phone validation', () => {
    it('should return error for phone with letters', () => {
      const formData = { ...validFormData, phone: 'abc-123-4567' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBe('Please enter a valid phone number');
    });

    it('should return error for phone with special characters not allowed', () => {
      const formData = { ...validFormData, phone: '123@456#7890' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBe('Please enter a valid phone number');
    });

    it('should accept phone numbers with dashes', () => {
      const formData = { ...validFormData, phone: '123-456-7890' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBeUndefined();
    });

    it('should accept phone numbers with parentheses', () => {
      const formData = { ...validFormData, phone: '(123) 456-7890' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBeUndefined();
    });

    it('should accept phone numbers with plus sign', () => {
      const formData = { ...validFormData, phone: '+1 123-456-7890' };
      const errors = validateSignUpForm(formData);
      expect(errors.phone).toBeUndefined();
    });
  });

  describe('invalid input - emergency contact phone validation', () => {
    it('should return error for emergency contact phone with letters', () => {
      const formData = { ...validFormData, emergencyContactPhone: 'abc-123-4567' };
      const errors = validateSignUpForm(formData);
      expect(errors.emergencyContactPhone).toBe('Please enter a valid phone number');
    });

    it('should accept valid emergency contact phone formats', () => {
      const validPhones = [
        '987-654-3210',
        '(987) 654-3210',
        '9876543210',
        '+1 987-654-3210',
      ];

      validPhones.forEach((phone) => {
        const formData = { ...validFormData, emergencyContactPhone: phone };
        const errors = validateSignUpForm(formData);
        expect(errors.emergencyContactPhone).toBeUndefined();
      });
    });
  });

  describe('multiple validation errors', () => {
    it('should return multiple errors when multiple fields are invalid', () => {
      const formData: SignUpFormData = {
        firstName: '',
        lastName: '',
        phone: 'invalid',
        email: 'invalid-email',
        password: '123',
        emergencyContactName: '',
        emergencyContactPhone: 'invalid',
      };

      const errors = validateSignUpForm(formData);

      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.phone).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(errors.emergencyContactName).toBeDefined();
      expect(errors.emergencyContactPhone).toBeDefined();
    });
  });
});

