import { useState, useRef } from 'react';
import { Phone, AlertTriangle } from 'lucide-react';

export function EmergencyButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    setHoldProgress(0);
    
    // Start progress animation
    progressIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
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

  const makeEmergencyCall = () => {
    setIsCalling(true);
    setIsPressed(false);
    setHoldProgress(0);
    
    // Clear intervals
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Simulate emergency call
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