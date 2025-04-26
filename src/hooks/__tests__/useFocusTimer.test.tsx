import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { useFocusTimer } from '../useFocusTimer';

// Test component exposing hook values and actions
const TestTimer: React.FC<{ duration: number }> = ({ duration }) => {
  const { timeLeft, progress, isActive, start, pause, reset, formatTime, toggle } =
    useFocusTimer({ duration, onComplete: () => {}, autoStart: false });
  return (
    <div>
      <span data-testid="timeLeft">{timeLeft}</span>
      <span data-testid="progress">{progress.toFixed(0)}</span>
      <span data-testid="isActive">{isActive.toString()}</span>
      <span data-testid="formatted">{formatTime(timeLeft)}</span>
      <button data-testid="start" onClick={start} />
      <button data-testid="pause" onClick={pause} />
      <button data-testid="reset" onClick={reset} />
      <button data-testid="toggle" onClick={toggle} />
    </div>
  );
};

describe('useFocusTimer hook', () => {
  const duration = 10; // seconds
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('initializes correctly when autoStart is false', () => {
    render(<TestTimer duration={duration} />);
    expect(screen.getByTestId('timeLeft').textContent).toBe(`${duration}`);
    expect(screen.getByTestId('progress').textContent).toBe('100');
    expect(screen.getByTestId('isActive').textContent).toBe('false');
    expect(screen.getByTestId('formatted').textContent).toBe('00:10');
  });

  it('start begins countdown', () => {
    render(<TestTimer duration={duration} />);
    fireEvent.click(screen.getByTestId('start'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('timeLeft').textContent).toBe('9');
    // progress should be 90%
    expect(screen.getByTestId('progress').textContent).toBe('90');
    expect(screen.getByTestId('isActive').textContent).toBe('true');
  });

  it('pause stops countdown', () => {
    render(<TestTimer duration={duration} />);
    fireEvent.click(screen.getByTestId('start'));
    fireEvent.click(screen.getByTestId('pause'));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('timeLeft').textContent).toBe(`${duration}`);
    expect(screen.getByTestId('isActive').textContent).toBe('false');
  });

  it('reset restores state', () => {
    render(<TestTimer duration={duration} />);
    fireEvent.click(screen.getByTestId('start'));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByTestId('timeLeft').textContent).toBe('7');
    fireEvent.click(screen.getByTestId('reset'));
    expect(screen.getByTestId('timeLeft').textContent).toBe(`${duration}`);
    expect(screen.getByTestId('progress').textContent).toBe('100');
    expect(screen.getByTestId('isActive').textContent).toBe('false');
  });

  it('toggle switches active state', () => {
    render(<TestTimer duration={duration} />);
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('isActive').textContent).toBe('true');
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('isActive').textContent).toBe('false');
  });
});