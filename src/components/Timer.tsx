import React, { useState, useEffect, useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CirclePlay, CircleStop, Coffee, Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  type: 'pomodoro' | 'break';
  task: string;
  onComplete: () => void;
  onCancel: () => void;
  onBreak?: (duration: number) => void;
  breakDuration?: number;
}

const Timer: React.FC<TimerProps> = ({ 
  type, 
  task, 
  onComplete, 
  onCancel, 
  onBreak,
  breakDuration 
}) => {
  const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
  const SHORT_BREAK = 5 * 60;    // 5 minutes in seconds
  const LONG_BREAK = 15 * 60;    // 15 minutes in seconds
  
  const [timeLeft, setTimeLeft] = useState(() => {
    if (type === 'break' && breakDuration) {
      return breakDuration;
    }
    return POMODORO_TIME;
  });

  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(100);
  const [currentDuration, setCurrentDuration] = useState(() => {
    if (type === 'break' && breakDuration) {
      return breakDuration;
    }
    return POMODORO_TIME;
  });

  const resetTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    setCurrentDuration(duration);
    setProgress(100);
    setIsActive(true);
  }, []);

  // Reset timer when type or breakDuration changes
  useEffect(() => {
    if (type === 'break' && breakDuration) {
      setTimeLeft(breakDuration);
      setCurrentDuration(breakDuration);
      setProgress(100);
    } else if (type === 'pomodoro') {
      setTimeLeft(POMODORO_TIME);
      setCurrentDuration(POMODORO_TIME);
      setProgress(100);
    }
  }, [type, breakDuration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          const newProgress = (newTime / currentDuration) * 100;
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentDuration, onComplete]);

  return (
    <div className="glass rounded-2xl w-[380px] animate-fade-in">
      <div className="text-center px-8 pt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {type === 'pomodoro' ? 'Focus Time' : 'Break Time'}
        </h2>
        
        <div className="mb-6">
          <div className="text-7xl font-light text-white mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white/80 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 pb-8">
          {/* Main controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-9 w-9"
            >
              {isActive ? <CircleStop className="h-5 w-5" /> : <CirclePlay className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-9 px-4"
            >
              Cancel
            </Button>
          </div>

          {/* Reset buttons */}
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetTimer(5 * 60)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2 text-xs"
            >
              <TimerIcon className="h-3 w-3 mr-1" />
              5m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetTimer(15 * 60)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2 text-xs"
            >
              <TimerIcon className="h-3 w-3 mr-1" />
              15m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetTimer(25 * 60)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2 text-xs"
            >
              <TimerIcon className="h-3 w-3 mr-1" />
              25m
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
