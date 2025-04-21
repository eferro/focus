import React, { useState, useEffect, useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  type: 'pomodoro' | 'break';
  task: string;
  onComplete: () => void;
  onCancel: () => void;
  onBreak?: (duration: number) => void;
  onStartFocus: (mode: 'pomodoro' | 'disconnection' | null) => void;
  breakDuration?: number;
}

const Timer: React.FC<TimerProps> = ({ 
  type, 
  task, 
  onComplete, 
  onCancel, 
  onBreak,
  onStartFocus,
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

  const [progress, setProgress] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(() => {
    if (type === 'break' && breakDuration) {
      return breakDuration;
    }
    return POMODORO_TIME;
  });

  const [isActive, setIsActive] = useState(true);

  // Update page title with timer
  useEffect(() => {
    if (!isActive) {
      document.title = 'Focus Timer';
      return;
    }

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const isBreak = type === 'break' || breakDuration !== undefined;
    const mode = isBreak ? 'Break' : 'Focus';
    document.title = `${timeStr} - ${mode}`;

    return () => {
      document.title = 'Focus Timer';
    };
  }, [timeLeft, type, breakDuration, isActive]);

  const resetTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    setCurrentDuration(duration);
    setProgress(100);
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
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
  }, [timeLeft, currentDuration, onComplete]);

  return (
    <div className="glass rounded-2xl w-[380px] animate-fade-in">
      <div className="text-center px-8 pt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {type === 'break' || breakDuration !== undefined ? 'Break Time' : 'Focus Time'}
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
              onClick={() => {
                setIsActive(false);
                onCancel();
              }}
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
              onClick={() => {
                onBreak(SHORT_BREAK);
                resetTimer(SHORT_BREAK);
                setIsActive(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2 text-xs"
            >
              <TimerIcon className="h-3 w-3 mr-1" />
              5m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onBreak(LONG_BREAK);
                resetTimer(LONG_BREAK);
                setIsActive(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2 text-xs"
            >
              <TimerIcon className="h-3 w-3 mr-1" />
              15m
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onStartFocus('pomodoro');
                resetTimer(POMODORO_TIME);
                setIsActive(true);
              }}
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
