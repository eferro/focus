import React, { useState, useEffect, useCallback } from 'react';
import { NATURE_IMAGES } from '../assets/images/backgrounds';
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';

interface BackgroundCanvasProps {
  onMouseMove: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ onMouseMove, onMouseLeave, children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(() => 
    Math.floor(Math.random() * NATURE_IMAGES.length)
  );

  const changeBackground = useCallback(() => {
    setCurrentImageIndex(current => {
      let newIndex = Math.floor(Math.random() * NATURE_IMAGES.length);
      // Make sure we don't get the same image twice
      if (newIndex === current && NATURE_IMAGES.length > 1) {
        newIndex = (newIndex + 1) % NATURE_IMAGES.length;
      }
      return newIndex;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(changeBackground, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [changeBackground]);

  const currentImage = NATURE_IMAGES[currentImageIndex];

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
            backgroundImage: `url(${currentImage})`, 
            opacity: 0.9 
          }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>
      
      {/* Controls layer */}
      <div className="absolute inset-x-0 top-0 z-50">
        {/* Background Change Button */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={changeBackground}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
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
