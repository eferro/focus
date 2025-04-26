import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timer from '../components/Timer';

// Mock the UI components
vi.mock('@/components/ui/button', () => {
  return {
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    )
  };
});

vi.mock('@/components/ui/progress', () => {
  return {
    Progress: ({ value, ...props }: any) => (
      <div role="progressbar" aria-valuenow={value} {...props} />
    )
  };
});

vi.mock('lucide-react', () => {
  return {
    Timer: () => <span data-testid="timer-icon">⏲️</span>
  };
});

describe('Timer', () => {
  const defaultProps = {
    type: 'pomodoro' as const,
    task: 'Test Task',
    onComplete: vi.fn(),
    onCancel: vi.fn(),
    onBreak: vi.fn(),
    onStartFocus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.title = 'Focus Timer';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders pomodoro timer with initial state', () => {
    render(<Timer {...defaultProps} />);
    
    // Check if the title is correct
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
    
    // Check if the initial time is displayed (25:00)
    expect(screen.getByText('25:00')).toBeInTheDocument();
    
    // Check if Cancel button is present
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    // Check for 5m, 15m, 25m buttons by text content
    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.textContent?.includes('5m'))).toBe(true);
    expect(buttons.some(btn => btn.textContent?.includes('15m'))).toBe(true);
    expect(buttons.some(btn => btn.textContent?.includes('25m'))).toBe(true);
  });

  it('updates timer every second', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText('25:00')).toBeInTheDocument();
    
    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('24:59')).toBeInTheDocument();
  });

  it('calls onComplete when timer reaches zero', () => {
    render(<Timer {...defaultProps} />);
    
    // Advance timer by 25 minutes
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    
    expect(defaultProps.onComplete).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    // Clicking cancel button should invoke onCancel immediately
    render(<Timer {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    act(() => {
      fireEvent.click(cancelButton);
    });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('handles short break button: calls onBreak and resets time to 05:00', () => {
    render(<Timer {...defaultProps} />);
    // Target the exact 5m button to avoid matching 15m or 25m
    const btn5 = screen.getByText(/^5m$/);
    act(() => {
      fireEvent.click(btn5);
    });
    expect(defaultProps.onBreak).toHaveBeenCalledWith(5 * 60);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('handles long break button: calls onBreak and resets time to 15:00', () => {
    render(<Timer {...defaultProps} />);
    const btn15 = screen.getByText(/^15m$/);
    act(() => {
      fireEvent.click(btn15);
    });
    expect(defaultProps.onBreak).toHaveBeenCalledWith(15 * 60);
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('handles restart button: calls onStartFocus and resets time to 25:00', () => {
    render(<Timer {...defaultProps} />);
    const btn25 = screen.getByText(/^25m$/);
    act(() => {
      fireEvent.click(btn25);
    });
    expect(defaultProps.onStartFocus).toHaveBeenCalledWith('pomodoro');
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
}); 