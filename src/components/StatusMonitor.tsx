import { Battery, Signal, Thermometer } from 'lucide-react';

export function StatusMonitor() {
  const batteryLevel = 85;
  const signalStrength = 4;
  const temperature = 22;

  // Get current theme from document
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'black-white';
  const isPurpleTheme = currentTheme === 'purple-yellow';

  return (
    <div className="p-6 bg-card border-4 border-border rounded-xl mb-6">
      <h2 className="text-2xl font-semibold mb-6">Cane Status</h2>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Battery Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Battery className={`w-7 h-7 ${
              isPurpleTheme ? 'text-white' : 
              batteryLevel > 20 ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className="text-xl">Battery</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold">{batteryLevel}%</span>
            <div className="w-24 h-4 bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Signal Strength */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Signal className={`w-7 h-7 ${isPurpleTheme ? 'text-white' : 'text-blue-600'}`} />
            <span className="text-xl">Signal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">{signalStrength}/5</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-3 h-5 rounded ${
                    bar <= signalStrength ? 
                      (isPurpleTheme ? 'bg-white' : 'bg-blue-500') : 
                      'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Thermometer className={`w-7 h-7 ${isPurpleTheme ? 'text-white' : 'text-orange-600'}`} />
            <span className="text-xl">Temperature</span>
          </div>
          <span className="text-2xl font-semibold">{temperature}°C</span>
        </div>
      </div>
    </div>
  );
}