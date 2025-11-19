import { useState, useRef } from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { useEmergencyContact } from '../state/EmergencyContactContext';

// Observer Pattern - Emergency Event Subject
export type EmergencyListener = () => void;

class EmergencyEventSubject {
  private static instance: EmergencyEventSubject;
  private listeners: Set<EmergencyListener> = new Set();

  static getInstance() {
    if (!EmergencyEventSubject.instance) {
      EmergencyEventSubject.instance = new EmergencyEventSubject();
    }
    return EmergencyEventSubject.instance;
  }

  register(listener: EmergencyListener) {
    this.listeners.add(listener);
  }
  unregister(listener: EmergencyListener) {
    this.listeners.delete(listener);
  }
  notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export function EmergencyButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { contact } = useEmergencyContact();

  const handleMouseDown = () => {
    setIsPressed(true);
    setHoldProgress(0);
    
    // Start progress animation
    progressIntervalRef.current = setInterval(() => {
      setHoldProgress((prev: number) => {
        const next = prev + (100 / 30); // 30 intervals over 3 seconds
        return next > 100 ? 100 : next;
      });
    }, 100);
    
    // Set timeout for emergency call
    holdTimeoutRef.current = setTimeout(() => {
      makeEmergencyCall();
    }, 3000);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    setHoldProgress(0);
    
    // Clear timeouts and intervals
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error("❌ Geolocation is not supported by this browser");
        resolve(null);
        return;
      }

      console.log("📍 Requesting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("✅ Location retrieved:", coords);
          resolve(coords);
        },
        (error) => {
          console.error("❌ Error getting location:", error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const sendEmergencySMS = async (location: { latitude: number; longitude: number } | null) => {
    if (!contact || !contact.phoneNumber) {
      console.warn("No emergency contact configured");
      alert("No emergency contact configured. Please set up an emergency contact in settings.");
      return;
    }

    const phoneNumber = contact.phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const locationText = location
      ? `My location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "Location unavailable";
    
    const message = `EMERGENCY: I need help! ${locationText}`;
    
    // Use SMS protocol to open default SMS app with pre-filled message
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    // Log for testing purposes
    console.log("🚨 Emergency Triggered!");
    console.log("Contact:", contact.name, phoneNumber);
    console.log("Location:", location || "Unavailable");
    console.log("SMS URL:", smsUrl);
    console.log("Message:", message);
    
    // Try to open SMS app
    window.location.href = smsUrl;
    
    // Fallback: If SMS protocol doesn't work, try tel: protocol
    // On some devices, we might need to use tel: instead
    setTimeout(() => {
      // If the page didn't navigate, try alternative method
      if (document.hasFocus()) {
        // Create a temporary link and click it
        const link = document.createElement('a');
        link.href = smsUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 100);
  };

  const makeEmergencyCall = async () => {
    setIsCalling(true);
    setIsPressed(false);
    setHoldProgress(0);
    
    // Clear intervals
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Observer Pattern: Notify all listeners
    EmergencyEventSubject.getInstance().notify();

    // Get current location
    const location = await getCurrentLocation();
    
    // Send SMS with location
    await sendEmergencySMS(location);

    // Reset calling state after a delay
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  return (
    <div className="p-6">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        disabled={isCalling}
        className={`relative w-full h-24 rounded-full border-4 transition-all duration-200 overflow-hidden ${
          isCalling
            ? 'bg-red-700 border-red-800 text-white'
            : isPressed
            ? 'bg-red-600 border-red-700 text-white'
            : 'bg-red-500 border-red-600 text-white hover:bg-red-600 active:bg-red-700'
        }`}
        style={{
          background: isPressed && !isCalling
            ? `linear-gradient(to right, #dc2626 ${holdProgress}%, #ef4444 ${holdProgress}%)`
            : undefined
        }}
      >
        <div className="flex items-center justify-center h-full">
          {isCalling ? (
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
              <span className="block text-lg font-bold">Calling Emergency...</span>
            </div>
          ) : (
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-1" />
              <span className="block text-lg font-bold">
                {isPressed ? 'Hold to Call...' : 'Tap to call for help'}
              </span>
            </div>
          )}
        </div>
      </button>
      
      {isPressed && !isCalling && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          Hold for {Math.ceil((3000 - (holdProgress * 30)) / 1000)} seconds
        </p>
      )}
    </div>
  );
}

// Helper to allow external modules to register/unregister listeners
export const EmergencyEvent = {
  register: (listener: EmergencyListener) => EmergencyEventSubject.getInstance().register(listener),
  unregister: (listener: EmergencyListener) => EmergencyEventSubject.getInstance().unregister(listener),
};