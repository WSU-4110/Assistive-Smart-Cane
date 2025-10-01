import { useState } from 'react';
import { Bluetooth, BluetoothConnected } from 'lucide-react';

export function BluetoothStatus() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="flex items-center justify-between p-6 bg-card border-4 border-border rounded-xl mb-6">
      <div className="flex items-center gap-4">
        {isConnected ? (
          <BluetoothConnected className="w-8 h-8 text-blue-600" />
        ) : (
          <Bluetooth className="w-8 h-8 text-gray-400" />
        )}
        <div>
          <p className="text-xl font-semibold">Smart Cane</p>
          <p className="text-xl text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsConnected(!isConnected)}
        className={`px-6 py-3 rounded-lg text-lg font-semibold border-2 ${
          isConnected
            ? 'bg-red-100 text-red-800 border-red-800 hover:bg-red-200'
            : 'bg-blue-100 text-blue-800 border-blue-800 hover:bg-blue-200'
        }`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}