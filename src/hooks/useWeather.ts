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
        console.log('Location obtained:', { latitude, longitude });
        
        // Using Open-Meteo API (free, no authentication required)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
        console.log('Fetching weather from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('API Response not OK:', {
            status: response.status,
            statusText: response.statusText
          });
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);

        // Get city name using reverse geocoding
        const geoUrl = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        const city = geoData.address?.city || geoData.address?.town || 'Unknown';
        
        setWeather({
          temp: data.current.temperature_2m,
          description: getWeatherDescription(data.current.weather_code),
          city
        });
      } catch (err) {
        console.error("Detailed error fetching weather:", err);
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

// Helper function to convert weather codes to descriptions
function getWeatherDescription(code: number): string {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  const weatherCodes: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  };
  return weatherCodes[code] || 'Clear';
}
