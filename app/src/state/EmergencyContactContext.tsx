import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type EmergencyContact = {
  name: string;
  phoneNumber: string;
};

type EmergencyContactState = {
  contact: EmergencyContact | null;
  setContact: (contact: EmergencyContact | null) => void;
};

const EmergencyContactContext = createContext<EmergencyContactState | undefined>(undefined);

const STORAGE_KEY = "emergency_contact";

export function EmergencyContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContactState] = useState<EmergencyContact | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContactState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse emergency contact from storage", e);
      }
    }
  }, []);

  const setContact = (newContact: EmergencyContact | null) => {
    setContactState(newContact);
    if (newContact) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContact));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <EmergencyContactContext.Provider value={{ contact, setContact }}>
      {children}
    </EmergencyContactContext.Provider>
  );
}

export function useEmergencyContact() {
  const ctx = useContext(EmergencyContactContext);
  if (!ctx) throw new Error("useEmergencyContact must be used inside EmergencyContactProvider");
  return ctx;
}

