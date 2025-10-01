import { useState } from 'react';
import { Vibrate, Volume2 } from 'lucide-react';

export function AlertSettings() {
  const [vibrationIntensity, setVibrationIntensity] = useState(50);
  const [buzzerVolume, setBuzzerVolume] = useState(75);

  // Get current theme from document
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'black-white';
  const isPurpleTheme = currentTheme === 'purple-yellow';

  const getSliderStyle = (value: number, color: string, sliderBg: string) => ({
    background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, ${sliderBg} ${value}%, ${sliderBg} 100%)`
  });

  return (
    <div className="p-6 bg-card border-4 border-border rounded-xl mb-6">
      <h2 className="text-2xl font-semibold mb-6">Alert Settings</h2>
      
      {/* Vibration Intensity */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Vibrate className={`w-7 h-7 ${isPurpleTheme ? 'text-white' : 'text-purple-600'}`} />
          <label className="text-xl font-medium">Vibration Intensity</label>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={vibrationIntensity}
            onChange={(e) => setVibrationIntensity(Number(e.target.value))}
            className="w-full h-5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={getSliderStyle(
              vibrationIntensity, 
              isPurpleTheme ? '#ffffff' : '#9333ea',
              isPurpleTheme ? '#9ca3af' : '#e5e7eb'
            )}
          />
          <div className="flex justify-between mt-3">
            <span className="text-xl text-muted-foreground">Low</span>
            <span className="text-xl font-semibold">{vibrationIntensity}%</span>
            <span className="text-xl text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      {/* Buzzer Volume */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className={`w-7 h-7 ${isPurpleTheme ? 'text-white' : 'text-blue-600'}`} />
          <label className="text-xl font-medium">Buzzer Volume</label>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={buzzerVolume}
            onChange={(e) => setBuzzerVolume(Number(e.target.value))}
            className="w-full h-5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={getSliderStyle(
              buzzerVolume,
              isPurpleTheme ? '#ffffff' : '#2563eb',
              isPurpleTheme ? '#9ca3af' : '#e5e7eb'
            )}
          />
          <div className="flex justify-between mt-3">
            <span className="text-xl text-muted-foreground">Quiet</span>
            <span className="text-xl font-semibold">{buzzerVolume}%</span>
            <span className="text-xl text-muted-foreground">Loud</span>
          </div>
        </div>
      </div>
    </div>
  );
}