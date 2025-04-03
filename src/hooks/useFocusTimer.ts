
import { useState, useEffect, useCallback } from 'react';

interface FocusTimerProps {
  duration: number;
  onComplete: () => void;
  autoStart?: boolean;
}

export function useFocusTimer({ duration, onComplete, autoStart = true }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const [progress, setProgress] = useState(100);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration, onComplete]);

  return {
    timeLeft,
    progress,
    isActive,
    start,
    pause,
    reset,
    formatTime,
    toggle: () => setIsActive(prev => !prev)
  };
}
