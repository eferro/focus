
import React, { useState, useEffect, useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CirclePlay, CircleStop } from 'lucide-react';

interface TimerProps {
  type: 'pomodoro' | 'break';
  task: string;
  onComplete: () => void;
  onCancel: () => void;
}

const Timer: React.FC<TimerProps> = ({ type, task, onComplete, onCancel }) => {
  const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60;     // 5 minutes in seconds
  
  const [timeLeft, setTimeLeft] = useState(type === 'pomodoro' ? POMODORO_TIME : BREAK_TIME);
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(100);
  
  const totalTime = type === 'pomodoro' ? POMODORO_TIME : BREAK_TIME;

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
          const newProgress = (newTime / totalTime) * 100;
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => clearInterval(timer);
  }, [isActive, timeLeft, totalTime, onComplete]);

  return (
    <div className="glass p-8 rounded-2xl w-full max-w-md animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
          {type === 'pomodoro' ? 'Focus Time' : 'Break Time'}
        </h2>
        
        <p className="text-white/80 mb-6">
          {task}
        </p>
        
        <div className="mb-6">
          <div className="text-5xl font-mono text-white drop-shadow-lg mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className="h-2 bg-white/30"
            indicatorClassName={type === 'pomodoro' ? "bg-focus-teal" : "bg-focus-blue"}
          />
        </div>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTimer}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {isActive ? <CircleStop className="h-6 w-6" /> : <CirclePlay className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
