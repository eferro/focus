import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Timer from './Timer';
import DisconnectionMode from './DisconnectionMode';
import { useWeather } from '../hooks/useWeather';
import { useGreeting } from '../hooks/useGreeting';
import { useShowControls } from '../hooks/useShowControls';
import { useTime } from '../hooks/useTime';
import { FocusMode } from '../types/focus';
import BackgroundCanvas from './BackgroundCanvas';
import Header from './Header';
import IdleMode from './IdleMode';

const FocusApp: React.FC = () => {
  const { toast } = useToast();
  const [focusMode, setFocusMode] = useState<FocusMode>(null);
  const [task, setTask] = useState<string>('');
  const [breakDuration, setBreakDuration] = useState<number | null>(null);
  const { weather, time } = useWeather();
  const { showControls, handleMouseMove, handleMouseLeave } = useShowControls();
  const greeting = useGreeting(time);
  const formatTime = useTime(time);

  const handleStartFocus = useCallback((mode: FocusMode) => {
    setFocusMode(mode);
    setBreakDuration(null);
    if (mode === 'pomodoro') {
      toast({
        title: "Pomodoro Started",
        description: "25 minutes of focus time. You can do it!",
      });
    } else if (mode === 'disconnection') {
      toast({
        title: "Disconnection Mode",
        description: "Stay still and relax. Any movement will reset the timer.",
      });
    }
  }, [toast]);

  const handleStartBreak = useCallback((duration: number) => {
    setBreakDuration(duration);
    toast({
      title: "Break Time",
      description: `Taking a ${duration / 60} minute break. Relax and recharge!`,
    });
  }, [toast]);

  const handleFocusComplete = useCallback(() => {
    if (breakDuration) {
      toast({
        title: "Break Complete",
        description: "Break time is over. Ready to focus again?",
      });
    } else {
      toast({
        title: "Good Job!",
        description: "Focus session completed. Take a well-deserved break.",
      });
    }
    setFocusMode(null);
    setBreakDuration(null);
  }, [toast, breakDuration]);

  const handleTaskChange = useCallback((newTask: string) => {
    setTask(newTask);
    localStorage.setItem('focusTask', newTask);
  }, []);

  useEffect(() => {
    const savedTask = localStorage.getItem('focusTask');
    if (savedTask) {
      setTask(savedTask);
    }
  }, []);

  return (
    <BackgroundCanvas onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <Header time={time} weather={weather} />
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {focusMode === null ? (
          <IdleMode
            time={time}
            greeting={greeting}
            task={task}
            onTaskChange={handleTaskChange}
            onStartFocus={handleStartFocus}
            showControls={showControls}
            formatTime={formatTime}
          />
        ) : focusMode === 'pomodoro' ? (
          <Timer 
            type={breakDuration ? 'break' : 'pomodoro'}
            task={task} 
            onComplete={handleFocusComplete}
            onCancel={() => {
              setFocusMode(null);
              setBreakDuration(null);
            }}
            onBreak={!breakDuration ? handleStartBreak : undefined}
            breakDuration={breakDuration || undefined}
          />
        ) : (
          <DisconnectionMode
            task={task}
            onComplete={handleFocusComplete}
            onCancel={() => setFocusMode(null)}
          />
        )}
      </div>
    </BackgroundCanvas>
  );
};

export default FocusApp;
