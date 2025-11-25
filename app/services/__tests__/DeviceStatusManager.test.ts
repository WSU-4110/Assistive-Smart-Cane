//
import { DeviceStatusManager } from '../DeviceStatusManager';
import { DeviceStatusObserver, DeviceStatus } from '../DeviceStatusObserver';

describe('DeviceStatusManager', () => {
  let manager: DeviceStatusManager;
  let mockObserver: DeviceStatusObserver;

  beforeEach(() => {
    (DeviceStatusManager as any).instance = undefined;
    manager = DeviceStatusManager.getInstance();
    
    mockObserver = {
      update: jest.fn()
    };
  });

  afterEach(() => {
    // stop the manager's background interval so Jest can exit cleanly
    try {
      manager.stopStatusUpdates();
    } catch (e) {
      // ignore if method not present
    }
    jest.clearAllTimers();
  });

  describe('getInstance', () => {
    test('should return singleton instance', () => {
      const instance1 = DeviceStatusManager.getInstance();
      const instance2 = DeviceStatusManager.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(DeviceStatusManager);
    });

    test('should create new instance only once', () => {
      const instance1 = DeviceStatusManager.getInstance();
      const instance2 = DeviceStatusManager.getInstance();
      const instance3 = DeviceStatusManager.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
    });
  });

  describe('attach', () => {
    test('should add observer to the list', () => {
      const observer2: DeviceStatusObserver = { update: jest.fn() };
      
      manager.attach(mockObserver);
      manager.attach(observer2);
      
      manager.notify();
      
      expect(mockObserver.update).toHaveBeenCalledTimes(1);
      expect(observer2.update).toHaveBeenCalledTimes(1);
    });

    test('should allow multiple observers', () => {
      const observer1: DeviceStatusObserver = { update: jest.fn() };
      const observer2: DeviceStatusObserver = { update: jest.fn() };
      const observer3: DeviceStatusObserver = { update: jest.fn() };
      
      manager.attach(observer1);
      manager.attach(observer2);
      manager.attach(observer3);
      
      manager.notify();
      
      expect(observer1.update).toHaveBeenCalledTimes(1);
      expect(observer2.update).toHaveBeenCalledTimes(1);
      expect(observer3.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('detach', () => {
    test('should remove observer from the list', () => {
      manager.attach(mockObserver);
      manager.detach(mockObserver);
      
      manager.notify();
      
      expect(mockObserver.update).not.toHaveBeenCalled();
    });

    test('should only remove specified observer', () => {
      const observer2: DeviceStatusObserver = { update: jest.fn() };
      
      manager.attach(mockObserver);
      manager.attach(observer2);
      manager.detach(mockObserver);
      
      manager.notify();
      
      expect(mockObserver.update).not.toHaveBeenCalled();
      expect(observer2.update).toHaveBeenCalledTimes(1);
    });

    test('should handle detaching non-existent observer gracefully', () => {
      const nonExistentObserver: DeviceStatusObserver = { update: jest.fn() };
      
      expect(() => {
        manager.detach(nonExistentObserver);
      }).not.toThrow();
    });
  });

  describe('getStatus', () => {
    test('should return current device status', () => {
      const status = manager.getStatus();
      
      expect(status).toHaveProperty('batteryLevel');
      expect(status).toHaveProperty('signalStrength');
      expect(status).toHaveProperty('temperature');
      expect(status).toHaveProperty('isConnected');
      expect(typeof status.batteryLevel).toBe('number');
      expect(typeof status.signalStrength).toBe('number');
      expect(typeof status.temperature).toBe('number');
      expect(typeof status.isConnected).toBe('boolean');
    });

    test('should return default values on initialization', () => {
      const status = manager.getStatus();
      
      expect(status.batteryLevel).toBe(85);
      expect(status.signalStrength).toBe(4);
      expect(status.temperature).toBe(22);
      expect(status.isConnected).toBe(false);
    });

    test('should return a copy of status object', () => {
      const status1 = manager.getStatus();
      const status2 = manager.getStatus();
      
      expect(status1).toEqual(status2);
      expect(status1).not.toBe(status2);
      
      status1.batteryLevel = 50;
      const status3 = manager.getStatus();
      expect(status3.batteryLevel).toBe(85);
    });
  });

  describe('updateConnectionStatus', () => {
    test('should update connection status to true', () => {
      manager.attach(mockObserver);
      
      manager.updateConnectionStatus(true);
      
      const status = manager.getStatus();
      expect(status.isConnected).toBe(true);
      expect(mockObserver.update).toHaveBeenCalledWith(
        expect.objectContaining({ isConnected: true })
      );
    });

    test('should update connection status to false', () => {
      manager.attach(mockObserver);
      
      manager.updateConnectionStatus(true);
      manager.updateConnectionStatus(false);
      
      const status = manager.getStatus();
      expect(status.isConnected).toBe(false);
      expect(mockObserver.update).toHaveBeenLastCalledWith(
        expect.objectContaining({ isConnected: false })
      );
    });

    test('should notify observers when connection status changes', () => {
      manager.attach(mockObserver);
      
      manager.updateConnectionStatus(true);
      
      expect(mockObserver.update).toHaveBeenCalledTimes(1);
      expect(mockObserver.update).toHaveBeenCalledWith(
        expect.objectContaining({ isConnected: true })
      );
    });
  });

  describe('notify', () => {
    test('should notify all attached observers', () => {
      const observer1: DeviceStatusObserver = { update: jest.fn() };
      const observer2: DeviceStatusObserver = { update: jest.fn() };
      
      manager.attach(observer1);
      manager.attach(observer2);
      
      manager.notify();
      
      expect(observer1.update).toHaveBeenCalledTimes(1);
      expect(observer2.update).toHaveBeenCalledTimes(1);
    });

    test('should pass current status to observers', () => {
      manager.attach(mockObserver);
      
      manager.notify();
      
      const expectedStatus = manager.getStatus();
      expect(mockObserver.update).toHaveBeenCalledWith(expectedStatus);
    });

    test('should not fail when no observers are attached', () => {
      expect(() => {
        manager.notify();
      }).not.toThrow();
    });

    test('should call each observer exactly once', () => {
      manager.attach(mockObserver);
      
      manager.notify();
      manager.notify();
      
      expect(mockObserver.update).toHaveBeenCalledTimes(2);
    });
  });
});