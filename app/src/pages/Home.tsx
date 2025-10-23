import { BluetoothStatus } from "../components/BluetoothStatus";
import { LedControl } from "../components/LedControl";
import { AlertSettings } from "../components/AlertSettings";
import { StatusMonitor } from "../components/StatusMonitor";
import { EmergencyButton } from "../components/EmergencyButton";
import { ColorTheme } from "../components/ColorTheme";
import { useDevice } from "../state/DeviceContext";

export default function Home() {
  const { device } = useDevice();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <header className="bg-card border-b-4 border-border p-6 text-center">
          <h1 className="text-3xl font-bold text-card-foreground">Smart Cane</h1>
          <p className="text-2xl text-muted-foreground mt-2">Assistant App</p>
        </header>

        <main className="p-4 pb-6">
          <p className="mb-3 text-sm text-muted-foreground text-center">
            {device.connected ? `Connected to ${device.name}` : "Not connected"}
          </p>

          <BluetoothStatus />
          <LedControl />
          <AlertSettings />
          <StatusMonitor />
          <ColorTheme />
        </main>

        <div className="sticky bottom-0 bg-background border-t-4 border-muted">
          <EmergencyButton />
        </div>
      </div>
    </div>
  );
}
