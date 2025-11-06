export interface DeviceStatus {
  batteryLevel: number;
  signalStrength: number;
  temperature: number;
  isConnected: boolean;
}

export interface DeviceStatusObserver {
  update(status: DeviceStatus): void;
}

export interface DeviceStatusSubject {
  attach(observer: DeviceStatusObserver): void;
  detach(observer: DeviceStatusObserver): void;
  notify(): void;
}