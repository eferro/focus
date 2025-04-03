
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import Timer from './Timer';
import WeatherDisplay from './WeatherDisplay';
import TaskInput from './TaskInput';
import AudioControls from './AudioControls';
import DisconnectionMode from './DisconnectionMode';
import { useAudio } from '../hooks/useAudio';

// Array of nature image URLs (normally would come from an API)
const NATURE_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Moraine_Lake_17092005.jpg/1280px-Moraine_Lake_17092005.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Clouds_over_the_Atlantic_Ocean.jpg/1280px-Clouds_over_the_Atlantic_Ocean.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Biandintz_eta_zaldiak_-_modified2.jpg/1280px-Biandintz_eta_zaldiak_-_modified2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_in_Bryce_Canyon.JPG/1280px-Sunrise_in_Bryce_Canyon.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Volcanoimage.jpg/1280px-Volcanoimage.jpg',
];

// Focus mode types
type FocusMode = 'pomodoro' | 'disconnection' | null;

const FocusApp: React.FC = () => {
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState('');
  const [focusMode, setFocusMode] = useState<FocusMode>(null);
  const [task, setTask] = useState<string>('');
  const { isPlaying, currentType, togglePlayback, changeType } = useAudio();

  // Initialize with a random nature image
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * NATURE_IMAGES.length);
    setCurrentImage(NATURE_IMAGES[randomIndex]);
  }, []);

  // Change image every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * NATURE_IMAGES.length);
      setCurrentImage(NATURE_IMAGES[randomIndex]);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartFocus = useCallback((mode: FocusMode) => {
    if (!task && (mode === 'pomodoro' || mode === 'disconnection')) {
      toast({
        title: "Task Missing",
        description: "Please enter what you'll be focusing on first.",
        variant: "destructive",
      });
      return;
    }

    setFocusMode(mode);
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
  }, [task, toast]);

  const handleFocusComplete = useCallback(() => {
    toast({
      title: "Good Job!",
      description: "Focus session completed. Take a well-deserved break.",
    });
    setFocusMode(null);
  }, [toast]);

  const handleTaskChange = useCallback((newTask: string) => {
    setTask(newTask);
    localStorage.setItem('focusTask', newTask);
  }, []);

  // Retrieve task from localStorage on component mount
  useEffect(() => {
    const savedTask = localStorage.getItem('focusTask');
    if (savedTask) {
      setTask(savedTask);
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentImage})`, opacity: 0.9 }}
      ></div>
      <div className="absolute inset-0 bg-focus-overlay"></div>
      
      {/* Weather & Time */}
      <div className="absolute top-4 right-4 z-10">
        <WeatherDisplay />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4">
        {focusMode === null ? (
          <div className="w-full max-w-md animate-fade-in">
            <div className="glass p-6 rounded-xl">
              <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
                Serene Focus
              </h1>
              
              <TaskInput value={task} onChange={handleTaskChange} />
              
              <div className="space-y-4 mt-6">
                <button
                  onClick={() => handleStartFocus('pomodoro')}
                  className="w-full py-3 px-4 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Pomodoro Focus</span>
                </button>
                
                <button
                  onClick={() => handleStartFocus('disconnection')}
                  className="w-full py-3 px-4 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Disconnection Mode</span>
                </button>
              </div>

              <div className="mt-6">
                <AudioControls 
                  isPlaying={isPlaying}
                  selectedType={currentType}
                  onToggle={togglePlayback}
                  onTypeChange={changeType}
                />
              </div>
            </div>
          </div>
        ) : focusMode === 'pomodoro' ? (
          <Timer 
            type="pomodoro"
            task={task} 
            onComplete={handleFocusComplete}
            onCancel={() => setFocusMode(null)}
          />
        ) : (
          <DisconnectionMode
            task={task}
            onComplete={handleFocusComplete}
            onCancel={() => setFocusMode(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FocusApp;
