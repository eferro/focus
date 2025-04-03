
import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { Cloud, Sun } from 'lucide-react';

const WeatherDisplay: React.FC = () => {
  const { weather, loading, time } = useWeather();

  const formatTime = () => {
    if (!time) return '--:--';
    
    return time.toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass p-3 rounded-xl flex flex-col items-end space-y-2 text-white animate-fade-in">
      <div className="text-xl font-light">{formatTime()}</div>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">Loading...</span>
        </div>
      ) : weather ? (
        <div className="flex items-center space-x-2">
          {weather.temp < 20 ? (
            <Cloud className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="text-sm">{Math.round(weather.temp)}°C</span>
          <span className="text-xs opacity-70">{weather.description}</span>
        </div>
      ) : (
        <div className="text-xs opacity-70">Weather data unavailable</div>
      )}
    </div>
  );
};

export default WeatherDisplay;
