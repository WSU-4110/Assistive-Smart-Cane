import { BluetoothStatus } from './components/BluetoothStatus';
import { LedControl } from './components/LedControl';
import { AlertSettings } from './components/AlertSettings';
import { StatusMonitor } from './components/StatusMonitor';
import { EmergencyButton } from './components/EmergencyButton';
import { ColorTheme } from './components/ColorTheme';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-background min-h-screen">
        {/* Header */}
        <header className="bg-card border-b-4 border-border p-6 text-center">
          <h1 className="text-3xl font-bold text-card-foreground">Smart Cane</h1>
          <p className="text-2xl text-muted-foreground mt-2">Assistant App</p>
        </header>

        {/* Main Content */}
        <main className="p-4 pb-6">
          {/* Bluetooth Connection Status */}
          <BluetoothStatus />

          {/* LED Control */}
          <LedControl />

          {/* Alert Settings */}
          <AlertSettings />

          {/* Status Monitoring */}
          <StatusMonitor />

          {/* Color Theme Selection */}
          <ColorTheme />
        </main>

        {/* Emergency Button - Fixed at bottom */}
        <div className="sticky bottom-0 bg-background border-t-4 border-muted">
          <EmergencyButton />
        </div>
      </div>
    </div>
  );
}