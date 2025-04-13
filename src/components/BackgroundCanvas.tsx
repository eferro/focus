
import React, { useState, useEffect } from 'react';

interface BackgroundCanvasProps {
  onMouseMove: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

const NATURE_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Moraine_Lake_17092005.jpg/1280px-Moraine_Lake_17092005.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Clouds_over_the_Atlantic_Ocean.jpg/1280px-Clouds_over_the_Atlantic_Ocean.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Biandintz_eta_zaldiak_-_modified2.jpg/1280px-Biandintz_eta_zaldiak_-_modified2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Sunrise_in_Bryce_Canyon.JPG/1280px-Sunrise_in_Bryce_Canyon.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Volcanoimage.jpg/1280px-Volcanoimage.jpg',
];

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ onMouseMove, onMouseLeave, children }) => {
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * NATURE_IMAGES.length);
    setCurrentImage(NATURE_IMAGES[randomIndex]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * NATURE_IMAGES.length);
      setCurrentImage(NATURE_IMAGES[randomIndex]);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="h-screen w-screen relative flex flex-col overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentImage})`, opacity: 0.9 }}
      ></div>
      <div className="absolute inset-0 bg-black/25"></div>
      
      {children}
    </div>
  );
};

export default BackgroundCanvas;
