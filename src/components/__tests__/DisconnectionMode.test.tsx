import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
// Using fireEvent for click to avoid issues with fake timers in userEvent
import DisconnectionMode from '../DisconnectionMode';

describe('DisconnectionMode', () => {
  const TASK_TEXT = 'Test Task';
  let onComplete: jest.Mock;
  let onCancel: jest.Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    onComplete = vi.fn();
    onCancel = vi.fn();
  });

  afterEach(() => {
    // Clear any pending timers without invoking callbacks to avoid act warnings
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders initial time and task text', () => {
    render(<DisconnectionMode task={TASK_TEXT} onComplete={onComplete} onCancel={onCancel} />);
    // Initial time is 02:00
    expect(screen.getByText(/02:00/)).toBeInTheDocument();
    expect(screen.getByText(TASK_TEXT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<DisconnectionMode task={TASK_TEXT} onComplete={onComplete} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('counts down and calls onComplete after time expires', () => {
    render(<DisconnectionMode task={TASK_TEXT} onComplete={onComplete} onCancel={onCancel} />);
    // Fast-forward past the full disconnection time (2 minutes)
    act(() => {
      vi.advanceTimersByTime(120 * 1000 + 1000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('resets timer on movement events', () => {
    render(<DisconnectionMode task={TASK_TEXT} onComplete={onComplete} onCancel={onCancel} />);
    // Advance a few seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Should show around 01:57
    expect(screen.getByText(/01:5[6-8]/)).toBeInTheDocument();
    // Simulate movement
    act(() => {
      // Trigger movement; timer state resets immediately
      window.dispatchEvent(new Event('mousemove'));
    });
    // After reset, timer should go back to full 02:00
    expect(screen.getByText(/02:00/)).toBeInTheDocument();
  });

  it('updates document.title with countdown in Disconnection mode', () => {
    // On mount, should set title to full time
    render(<DisconnectionMode task={TASK_TEXT} onComplete={onComplete} onCancel={onCancel} />);
    expect(document.title).toBe('02:00 - Disconnection');
    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // Title should update to 01:59
    expect(document.title).toMatch(/^01:59 - Disconnection$/);
  });
});