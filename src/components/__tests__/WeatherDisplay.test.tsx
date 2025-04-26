import React from 'react';
import { render, screen } from '@testing-library/react';
import { Cloud, Sun } from 'lucide-react';
import { vi } from 'vitest';

// Mock useWeather hook
vi.mock('../../hooks/useWeather', () => ({
  useWeather: vi.fn(),
}));

import WeatherDisplay from '../WeatherDisplay';
import { useWeather } from '../../hooks/useWeather';

describe('WeatherDisplay', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading state when loading is true', () => {
    (useWeather as vi.Mock).mockReturnValue({ weather: null, loading: true, time: null });
    render(<WeatherDisplay />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows weather info when available and uses Cloud icon for cold temps', () => {
    const mockTime = new Date(2021, 0, 1, 9, 5);
    (useWeather as vi.Mock).mockReturnValue({
      weather: { temp: 12.3, description: 'Cloudy' },
      loading: false,
      time: mockTime,
    });
    render(<WeatherDisplay />);
    // Time should include HH:MM (locale may append AM/PM)
    expect(screen.getByText(/^09:05/)).toBeInTheDocument();
    // Cloud icon present
    expect(screen.getByTestId(Cloud.displayName)).toBeInTheDocument();
    // Temperature and description
    expect(screen.getByText('12°C')).toBeInTheDocument();
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
  });

  it('uses Sun icon for warm temps', () => {
    (useWeather as vi.Mock).mockReturnValue({
      weather: { temp: 25, description: 'Sunny' },
      loading: false,
      time: new Date(),
    });
    render(<WeatherDisplay />);
    expect(screen.getByTestId(Sun.displayName)).toBeInTheDocument();
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('shows unavailable state when weather is null and loading is false', () => {
    (useWeather as vi.Mock).mockReturnValue({ weather: null, loading: false, time: null });
    render(<WeatherDisplay />);
    expect(screen.getByText(/weather data unavailable/i)).toBeInTheDocument();
  });
});