import { useState } from 'react';
import { Lightbulb, LightbulbOff } from 'lucide-react';

export function LedControl() {
  const [isLedOn, setIsLedOn] = useState(true);

  return (
    <div className="p-6 bg-card border-4 border-border rounded-xl mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isLedOn ? (
            <Lightbulb className="w-8 h-8 text-yellow-500" />
          ) : (
            <LightbulbOff className="w-8 h-8 text-gray-400" />
          )}
          <span className="text-xl font-semibold">LED Light</span>
        </div>
        <button
          onClick={() => setIsLedOn(!isLedOn)}
          className={`relative inline-flex h-12 w-24 items-center rounded-full border-4 transition-colors ${
            isLedOn 
              ? 'bg-green-500 border-green-600' 
              : 'bg-gray-300 border-gray-400'
          }`}
        >
          <span
            className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
              isLedOn ? 'translate-x-10' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="mt-3 text-2xl text-muted-foreground">
        {isLedOn ? 'LED is ON' : 'LED is OFF'}
      </p>
    </div>
  );
}