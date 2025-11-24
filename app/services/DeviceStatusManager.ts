import { DeviceStatus, DeviceStatusObserver, DeviceStatusSubject } from './DeviceStatusObserver';

export class DeviceStatusManager implements DeviceStatusSubject {
  private observers: DeviceStatusObserver[] = [];
  private status: DeviceStatus = {
    batteryLevel: 85,
    signalStrength: 4,
    temperature: 22,
    isConnected: false,
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private static instance: DeviceStatusManager;

  private constructor() {
    this.startStatusUpdates();
  }

  public static getInstance(): DeviceStatusManager {
    if (!DeviceStatusManager.instance) {
      DeviceStatusManager.instance = new DeviceStatusManager();
    }
    return DeviceStatusManager.instance;
  }

  attach(observer: DeviceStatusObserver): void {
    this.observers.push(observer);
  }

  detach(observer: DeviceStatusObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(): void {
    this.observers.forEach(observer => observer.update(this.status));
  }

  getStatus(): DeviceStatus {
    return { ...this.status };
  }

  updateConnectionStatus(isConnected: boolean): void {
    this.status.isConnected = isConnected;
    this.notify();
  }

  private startStatusUpdates(): void {
    this.intervalId = setInterval(() => {
      if (this.status.isConnected) {
        this.status.batteryLevel = Math.max(0, this.status.batteryLevel - Math.random() * 0.5);
        this.status.signalStrength = Math.floor(Math.random() * 5) + 1;
        this.status.temperature = 20 + Math.random() * 10;
        this.notify();
      }
    }, 3000);
  }

  // Stop the periodic status updates (useful for tests and shutdown)
  public stopStatusUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}