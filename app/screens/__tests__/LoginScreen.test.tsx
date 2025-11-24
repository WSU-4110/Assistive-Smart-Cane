/**
 * Unit tests for LoginScreen validation logic
 * Tests the validateForm function behavior with various inputs
 */

import { LoginFormData } from '../../types/auth';

// Validation logic extracted from LoginScreen for testing
const validateLoginForm = (formData: LoginFormData): Partial<Record<keyof LoginFormData, string>> => {
  const errors: Partial<Record<keyof LoginFormData, string>> = {};

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

  return errors;
};

describe('LoginScreen - validateForm', () => {
  const validFormData: LoginFormData = {
    email: 'user@example.com',
    password: 'password123',
  };

  describe('valid input', () => {
    it('should return no errors for valid form data', () => {
      const errors = validateLoginForm(validFormData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@example-domain.com',
      ];

      validEmails.forEach((email) => {
        const formData = { ...validFormData, email };
        const errors = validateLoginForm(formData);
        expect(errors.email).toBeUndefined();
      });
    });

    it('should accept password with exactly 6 characters', () => {
      const formData = { ...validFormData, password: '123456' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBeUndefined();
    });

    it('should accept password with more than 6 characters', () => {
      const formData = { ...validFormData, password: 'verylongpassword123' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBeUndefined();
    });
  });

  describe('invalid input - empty fields', () => {
    it('should return error when email is empty', () => {
      const formData = { ...validFormData, email: '' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Email is required');
    });

    it('should return error when email is only whitespace', () => {
      const formData = { ...validFormData, email: '   ' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Email is required');
    });

    it('should return error when password is empty', () => {
      const formData = { ...validFormData, password: '' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBe('Password is required');
    });
  });

  describe('invalid input - email validation', () => {
    it('should return error for email without @ symbol', () => {
      const formData = { ...validFormData, email: 'invalidemail.com' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email without domain', () => {
      const formData = { ...validFormData, email: 'invalid@email' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email without TLD', () => {
      const formData = { ...validFormData, email: 'invalid@email.' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email with spaces', () => {
      const formData = { ...validFormData, email: 'invalid @email.com' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email starting with @', () => {
      const formData = { ...validFormData, email: '@example.com' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should return error for email ending with @', () => {
      const formData = { ...validFormData, email: 'user@' };
      const errors = validateLoginForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
    });
  });

  describe('invalid input - password validation', () => {
    it('should return error when password is less than 6 characters', () => {
      const formData = { ...validFormData, password: '12345' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should return error when password is exactly 5 characters', () => {
      const formData = { ...validFormData, password: '12345' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should return error when password is empty string', () => {
      const formData = { ...validFormData, password: '' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBe('Password is required');
    });

    it('should accept password with exactly 6 characters', () => {
      const formData = { ...validFormData, password: '123456' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBeUndefined();
    });

    it('should accept password with special characters', () => {
      const formData = { ...validFormData, password: 'p@ssw0rd!' };
      const errors = validateLoginForm(formData);
      expect(errors.password).toBeUndefined();
    });
  });

  describe('multiple validation errors', () => {
    it('should return both email and password errors when both are invalid', () => {
      const formData: LoginFormData = {
        email: 'invalid-email',
        password: '123',
      };

      const errors = validateLoginForm(formData);

      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should return both errors when both fields are empty', () => {
      const formData: LoginFormData = {
        email: '',
        password: '',
      };

      const errors = validateLoginForm(formData);

      expect(errors.email).toBe('Email is required');
      expect(errors.password).toBe('Password is required');
    });

    it('should return only email error when email is invalid but password is valid', () => {
      const formData: LoginFormData = {
        email: 'invalid-email',
        password: 'validpassword123',
      };

      const errors = validateLoginForm(formData);

      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.password).toBeUndefined();
    });

    it('should return only password error when email is valid but password is invalid', () => {
      const formData: LoginFormData = {
        email: 'valid@example.com',
        password: '123',
      };

      const errors = validateLoginForm(formData);

      expect(errors.email).toBeUndefined();
      expect(errors.password).toBe('Password must be at least 6 characters');
    });
  });

  describe('edge cases', () => {
    it('should handle email with multiple @ symbols', () => {
      const formData = { ...validFormData, email: 'user@@example.com' };
      const errors = validateLoginForm(formData);
      // Note: The regex /\S+@\S+\.\S+/ accepts multiple @ symbols as it matches any non-whitespace
      // This is a limitation of the simple regex pattern used
      expect(errors.email).toBeUndefined();
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const formData = { ...validFormData, email: longEmail };
      const errors = validateLoginForm(formData);
      // Should still validate format even if very long
      expect(errors.email).toBeUndefined();
    });

    it('should handle very long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      const formData = { ...validFormData, password: longPassword };
      const errors = validateLoginForm(formData);
      // Should accept long passwords as long as they meet minimum length
      expect(errors.password).toBeUndefined();
    });
  });
});

