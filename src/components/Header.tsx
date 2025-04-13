import React from 'react';

interface HeaderProps {
  time: Date | null;
  weather: {
    temp: number;
    city: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ time, weather }) => {
  const formatTime = () => {
    if (!time) return '--:--';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-end p-4 z-20 text-white/80">
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
