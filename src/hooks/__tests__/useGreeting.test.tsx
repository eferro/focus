import React from 'react';
import { render, screen } from '@testing-library/react';
import { useGreeting } from '../useGreeting';

// Test component to display greeting
const GreetingComponent: React.FC<{ time: Date | null }> = ({ time }) => {
  const greeting = useGreeting(time);
  return <div data-testid="greeting">{greeting}</div>;
};

describe('useGreeting hook', () => {
  it('returns empty string when time is null', () => {
    render(<GreetingComponent time={null} />);
    expect(screen.getByTestId('greeting').textContent).toBe('');
    expect(screen.queryByText(/Good/)).toBeNull();
  });

  it('says Good morning for hours between 5 and 11', () => {
    const time = new Date(2021, 0, 1, 8, 30);
    render(<GreetingComponent time={time} />);
    expect(screen.getByText('Good morning.')).toBeInTheDocument();
  });

  it('says Good afternoon for hours between 12 and 17', () => {
    const time = new Date(2021, 0, 1, 15, 0);
    render(<GreetingComponent time={time} />);
    expect(screen.getByText('Good afternoon.')).toBeInTheDocument();
  });

  it('says Good evening for hours 18 and later', () => {
    const evening = new Date(2021, 0, 1, 20, 0);
    render(<GreetingComponent time={evening} />);
    expect(screen.getByText('Good evening.')).toBeInTheDocument();
  });

  it('says Good evening for hours before 5', () => {
    const early = new Date(2021, 0, 1, 2, 0);
    render(<GreetingComponent time={early} />);
    expect(screen.getByText('Good evening.')).toBeInTheDocument();
  });
});