import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';
import { useBackgroundSound } from '../hooks/useBackgroundSound';
import AudioControl from './AudioControl';

const TOTAL_PHOTOS = 38;

const getPhotoPath = (index: number) => {
  const paddedNumber = String(index).padStart(4, '0');
  return `/focus/photos/photo_${paddedNumber}.webp`;
};

interface BackgroundCanvasProps {
  onMouseMove: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ onMouseMove, onMouseLeave, children }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(() => 
    Math.floor(Math.random() * TOTAL_PHOTOS) + 1
  );

  const { isPlaying, volume, currentSound, sounds, togglePlayback, adjustVolume, changeSound } = useBackgroundSound();

  const changeBackground = useCallback(() => {
    setCurrentPhotoIndex(current => {
      let newIndex = Math.floor(Math.random() * TOTAL_PHOTOS) + 1;
      // Make sure we don't get the same image twice
      if (newIndex === current && TOTAL_PHOTOS > 1) {
        newIndex = (newIndex % TOTAL_PHOTOS) + 1;
      }
      return newIndex;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(changeBackground, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [changeBackground]);

  const currentPhotoPath = getPhotoPath(currentPhotoIndex);

  return (
    <div 
      className="h-screen w-screen relative flex flex-col overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${currentPhotoPath})`, 
            opacity: 0.9 
          }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>
      
      {/* Controls layer */}
      <div className="absolute inset-x-0 top-0 z-50">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={changeBackground}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <AudioControl
            isPlaying={isPlaying}
            volume={volume}
            currentSound={currentSound}
            sounds={sounds}
            onToggle={togglePlayback}
            onVolumeChange={adjustVolume}
            onSoundChange={changeSound}
          />
        </div>
      </div>
      
      {/* Content layer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default BackgroundCanvas;
