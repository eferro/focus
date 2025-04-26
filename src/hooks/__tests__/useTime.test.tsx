import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTime } from '../useTime';

// Test component to display formatted time
const TimeComponent: React.FC<{ time: Date | null }> = ({ time }) => {
  const formatTime = useTime(time);
  return <div>{formatTime()}</div>;
};

describe('useTime hook', () => {
  it('returns placeholder when time is null', () => {
    render(<TimeComponent time={null} />);
    expect(screen.getByText('--:--')).toBeInTheDocument();
  });

  it('formats time correctly as HH:MM', () => {
    const time = new Date(2021, 0, 1, 5, 7);
    render(<TimeComponent time={time} />);
    expect(screen.getByText('05:07')).toBeInTheDocument();
  });

  it('pads single digit hours and minutes', () => {
    const time = new Date(2021, 0, 1, 9, 3);
    render(<TimeComponent time={time} />);
    expect(screen.getByText('09:03')).toBeInTheDocument();
  });
});