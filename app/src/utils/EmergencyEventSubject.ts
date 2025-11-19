/**
 * Emergency Event Subject - Observer Pattern Implementation
 * 
 * Manages emergency event listeners and notifies them when emergency events occur.
 * Uses Singleton pattern to ensure only one instance exists.
 */

export type EmergencyListener = () => void;

export class EmergencyEventSubject {
  private static instance: EmergencyEventSubject;
  private listeners: Set<EmergencyListener> = new Set();

  static getInstance(): EmergencyEventSubject {
    if (!EmergencyEventSubject.instance) {
      EmergencyEventSubject.instance = new EmergencyEventSubject();
    }
    return EmergencyEventSubject.instance;
  }

  register(listener: EmergencyListener): void {
    this.listeners.add(listener);
  }

  unregister(listener: EmergencyListener): void {
    this.listeners.delete(listener);
  }

  notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Helper methods for testing
  getListenerCount(): number {
    return this.listeners.size;
  }

  clear(): void {
    this.listeners.clear();
  }
}

