
import React from 'react';
import { WeatherInfo } from '../types/weather';

interface HeaderProps {
  time: Date | null;
  weather: WeatherInfo | null;
}

const Header: React.FC<HeaderProps> = ({ time, weather }) => {
  const formatTime = () => {
    if (!time) return '--:--';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  return (
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
  );
};

export default Header;
