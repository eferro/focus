import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header component', () => {
  it('displays weather temperature and city when weather prop is provided', () => {
    const mockTime = new Date(2021, 0, 1, 10, 5);
    const weather = { temp: 12.6, city: 'TestCity' };
    render(<Header time={mockTime} weather={weather} />);
    // Temperature is rounded
    expect(screen.getByText('13°')).toBeInTheDocument();
    // City name displayed
    expect(screen.getByText('TestCity')).toBeInTheDocument();
  });

  it('renders nothing extra when weather prop is null', () => {
    const { container } = render(<Header time={null} weather={null} />);
    // The container should only have the root divs, no temperature or city text
    expect(container.textContent).toBe('');
  });
});