/**
 * Unit Tests for EmergencyEventSubject Class
 * 
 * Tests the Observer Pattern implementation for emergency events.
 * This class manages listeners and notifies them when emergency events occur.
 */

import { EmergencyEventSubject } from '../../utils/EmergencyEventSubject';

describe('EmergencyEventSubject', () => {
  let subject: EmergencyEventSubject;
  let mockListener1: jest.Mock;
  let mockListener2: jest.Mock;
  let mockListener3: jest.Mock;

  beforeEach(() => {
    // Reset singleton instance for each test
    (EmergencyEventSubject as any).instance = undefined;
    subject = EmergencyEventSubject.getInstance();
    
    // Create mock listeners
    mockListener1 = jest.fn();
    mockListener2 = jest.fn();
    mockListener3 = jest.fn();
  });

  afterEach(() => {
    subject.clear();
  });

  describe('getInstance', () => {
    test('should return a singleton instance', () => {
      const instance1 = EmergencyEventSubject.getInstance();
      const instance2 = EmergencyEventSubject.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(EmergencyEventSubject);
    });

    test('should create instance only once', () => {
      const instance1 = EmergencyEventSubject.getInstance();
      const instance2 = EmergencyEventSubject.getInstance();
      const instance3 = EmergencyEventSubject.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(instance3);
    });

    test('should return the same instance across multiple calls', () => {
      const instances = Array.from({ length: 10 }, () => 
        EmergencyEventSubject.getInstance()
      );
      
      const firstInstance = instances[0];
      instances.forEach(instance => {
        expect(instance).toBe(firstInstance);
      });
    });
  });

  describe('register', () => {
    test('should add a listener to the listeners set', () => {
      expect(subject.getListenerCount()).toBe(0);
      
      subject.register(mockListener1);
      
      expect(subject.getListenerCount()).toBe(1);
    });

    test('should allow multiple listeners to be registered', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      subject.register(mockListener3);
      
      expect(subject.getListenerCount()).toBe(3);
    });

    test('should not add duplicate listeners', () => {
      subject.register(mockListener1);
      subject.register(mockListener1);
      subject.register(mockListener1);
      
      expect(subject.getListenerCount()).toBe(1);
    });

    test('should handle registering null or undefined gracefully', () => {
      // TypeScript prevents null/undefined, but test that Set handles it
      const nullListener = null as any;
      subject.register(nullListener);
      expect(subject.getListenerCount()).toBe(1);
    });
  });

  describe('unregister', () => {
    test('should remove a registered listener', () => {
      subject.register(mockListener1);
      expect(subject.getListenerCount()).toBe(1);
      
      subject.unregister(mockListener1);
      
      expect(subject.getListenerCount()).toBe(0);
    });

    test('should only remove the specified listener', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      subject.register(mockListener3);
      
      subject.unregister(mockListener2);
      
      expect(subject.getListenerCount()).toBe(2);
    });

    test('should handle unregistering non-existent listener gracefully', () => {
      expect(() => {
        subject.unregister(mockListener1);
      }).not.toThrow();
      
      expect(subject.getListenerCount()).toBe(0);
    });

    test('should allow unregistering the same listener multiple times', () => {
      subject.register(mockListener1);
      subject.unregister(mockListener1);
      subject.unregister(mockListener1);
      subject.unregister(mockListener1);
      
      expect(subject.getListenerCount()).toBe(0);
    });
  });

  describe('notify', () => {
    test('should call all registered listeners', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      subject.register(mockListener3);
      
      subject.notify();
      
      expect(mockListener1).toHaveBeenCalledTimes(1);
      expect(mockListener2).toHaveBeenCalledTimes(1);
      expect(mockListener3).toHaveBeenCalledTimes(1);
    });

    test('should not call unregistered listeners', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      subject.unregister(mockListener1);
      
      subject.notify();
      
      expect(mockListener1).not.toHaveBeenCalled();
      expect(mockListener2).toHaveBeenCalledTimes(1);
    });

    test('should handle notify with no listeners gracefully', () => {
      expect(() => {
        subject.notify();
      }).not.toThrow();
    });

    test('should call listeners in the order they were registered', () => {
      const callOrder: number[] = [];
      
      const listener1 = () => callOrder.push(1);
      const listener2 = () => callOrder.push(2);
      const listener3 = () => callOrder.push(3);
      
      subject.register(listener1);
      subject.register(listener2);
      subject.register(listener3);
      
      subject.notify();
      
      // Note: Set iteration order is insertion order in modern JS
      expect(callOrder).toEqual([1, 2, 3]);
    });

    test('should call all listeners on multiple notify calls', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      
      subject.notify();
      subject.notify();
      subject.notify();
      
      expect(mockListener1).toHaveBeenCalledTimes(3);
      expect(mockListener2).toHaveBeenCalledTimes(3);
    });

    test('should propagate errors from listeners', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();
      
      subject.register(errorListener);
      subject.register(normalListener);
      
      // The error will be thrown and stop execution
      expect(() => {
        subject.notify();
      }).toThrow('Listener error');
      
      // Error listener is called before throwing
      expect(errorListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration tests', () => {
    test('should handle complete register-notify-unregister cycle', () => {
      subject.register(mockListener1);
      subject.register(mockListener2);
      
      subject.notify();
      expect(mockListener1).toHaveBeenCalledTimes(1);
      expect(mockListener2).toHaveBeenCalledTimes(1);
      
      subject.unregister(mockListener1);
      subject.notify();
      
      expect(mockListener1).toHaveBeenCalledTimes(1); // Still 1
      expect(mockListener2).toHaveBeenCalledTimes(2); // Now 2
    });

    test('should maintain state across multiple operations', () => {
      subject.register(mockListener1);
      subject.notify();
      subject.register(mockListener2);
      subject.notify();
      subject.unregister(mockListener1);
      subject.notify();
      
      expect(mockListener1).toHaveBeenCalledTimes(2);
      expect(mockListener2).toHaveBeenCalledTimes(2);
    });
  });
});

