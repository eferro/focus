
import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  description: string;
  city: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  // Update time every second
  useEffect(() => {
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        const { latitude, longitude } = position.coords;
        
        // OpenWeatherMap API (free tier)
        const apiKey = '4a7b7064bbe6b175b284e73c71d9d346'; // Free demo API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].main,
          city: data.name
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Set fallback data
        setWeather({
          temp: 20,
          description: 'Clear',
          city: 'Unknown'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refetch weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error, time };
}
