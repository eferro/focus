
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import Timer from './Timer';
import WeatherDisplay from './WeatherDisplay';
import TaskInput from './TaskInput';
import AudioControls from './AudioControls';
import DisconnectionMode from './DisconnectionMode';
import { useAudio } from '../hooks/useAudio';
import { useWeather } from '../hooks/useWeather';

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
  const { isPlaying, currentType, volume, togglePlayback, changeType, adjustVolume } = useAudio();
  const { weather, time } = useWeather();
  const [showControls, setShowControls] = useState(false);
  const [greeting, setGreeting] = useState('');

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

  // Set greeting based on time of day
  useEffect(() => {
    if (!time) return;
    
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting('Good morning.');
    } else if (hours >= 12 && hours < 18) {
      setGreeting('Good afternoon.');
    } else {
      setGreeting('Good evening.');
    }
  }, [time]);

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

  // Format time to HH:MM
  const formatTime = () => {
    if (!time) return '--:--';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div 
      className="h-screen w-screen relative flex flex-col overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setTimeout(() => setShowControls(false), 3000)}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentImage})`, opacity: 0.9 }}
      ></div>
      <div className="absolute inset-0 bg-black/25"></div>
      
      {/* Top navigation */}
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4 z-20 text-white/80">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <span className="text-sm">Links</span>
            <span className="text-xs font-light">Focus</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {weather && (
            <div className="flex items-center">
              <span className="text-sm">{Math.round(weather.temp)}°</span>
              <span className="text-xs ml-1">{weather.city}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {focusMode === null ? (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Time and greeting */}
            <div className="text-center mb-16">
              <h1 className="text-9xl font-extralight text-white tracking-wide mb-2">{formatTime()}</h1>
              <p className="text-3xl text-white/90 font-light">{greeting}</p>
            </div>
            
            {/* Task input */}
            <div className="w-full max-w-xl">
              <TaskInput 
                value={task} 
                onChange={handleTaskChange} 
                placeholder="What is your main goal for today?"
                className="text-xl text-center"
              />
            </div>
            
            {/* Quote */}
            <div className="absolute bottom-20 w-full text-center">
              <p className="text-white/80 text-sm italic">
                "The greatest project you'll ever work on is you."
              </p>
            </div>
            
            {/* Focus buttons - show only when mouse moves */}
            <div 
              className={`absolute top-20 right-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleStartFocus('pomodoro')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
                >
                  Pomodoro Focus
                </button>
                <button
                  onClick={() => handleStartFocus('disconnection')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
                >
                  Disconnection Mode
                </button>
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
      
      {/* Audio controls - fixed at the bottom of the screen */}
      <div 
        className={`fixed bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-xs mx-auto">
          <AudioControls 
            isPlaying={isPlaying}
            selectedType={currentType}
            volume={volume}
            onToggle={togglePlayback}
            onTypeChange={changeType}
            onVolumeChange={adjustVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default FocusApp;
