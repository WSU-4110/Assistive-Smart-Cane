import { createContext, useContext, useState, ReactNode } from "react";

type Device = { id: string; name: string };
type DeviceState = { connected: boolean; id?: string; name?: string };

type Ctx = {
  device: DeviceState;
  connect: (d: Device) => void;
  disconnect: () => void;
};

const DeviceContext = createContext<Ctx | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<DeviceState>({ connected: false });

  const connect = (d: Device) => setDevice({ connected: true, id: d.id, name: d.name });
  const disconnect = () => setDevice({ connected: false });

  return (
    <DeviceContext.Provider value={{ device, connect, disconnect }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used inside DeviceProvider");
  return ctx;
}
