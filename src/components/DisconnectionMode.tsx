
import React, { useState, useEffect, useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DisconnectionModeProps {
  task: string;
  onComplete: () => void;
  onCancel: () => void;
}

const DisconnectionMode: React.FC<DisconnectionModeProps> = ({ 
  task, 
  onComplete, 
  onCancel 
}) => {
  const DISCONNECTION_TIME = 2 * 60; // 2 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(DISCONNECTION_TIME);
  const [progress, setProgress] = useState(100);
  const [hasMovement, setHasMovement] = useState(false);
  
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Reset timer on movement
  const handleMovement = useCallback(() => {
    setTimeLeft(DISCONNECTION_TIME);
    setProgress(100);
    setHasMovement(true);
    
    // Clear movement state after a short delay
    setTimeout(() => {
      setHasMovement(false);
    }, 1000);
  }, [DISCONNECTION_TIME]);

  useEffect(() => {
    // Set up event listeners for movement
    const handleMouseMove = () => handleMovement();
    const handleKeyDown = () => handleMovement();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMovement]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          const newProgress = (newTime / DISCONNECTION_TIME) * 100;
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    } else {
      onComplete();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, DISCONNECTION_TIME, onComplete]);

  return (
    <div className={`glass p-8 rounded-2xl w-full max-w-md animate-fade-in ${hasMovement ? 'border-red-400' : ''}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
          Disconnection Mode
        </h2>
        
        <p className="text-white/80 mb-6">
          Stay still and present. Any movement will reset the timer.
        </p>
        
        <div className="mb-6">
          <div className="text-5xl font-mono text-white drop-shadow-lg mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className="h-2 bg-white/30"
            indicatorClassName="bg-focus-blue"
          />
        </div>
        
        {hasMovement && (
          <div className="text-red-300 mb-4 animate-pulse-subtle">
            Movement detected! Timer reset.
          </div>
        )}
        
        <p className="text-white/70 italic text-sm mb-6">
          {task}
        </p>
        
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DisconnectionMode;
