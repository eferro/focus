import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock hooks and components
vi.mock('@/hooks/use-toast', () => ({ useToast: vi.fn() }));
vi.mock('../hooks/useWeather', () => ({ useWeather: () => ({ weather: null, time: new Date() }) }));
vi.mock('../hooks/useGreeting', () => ({ useGreeting: () => 'Hello' }));
vi.mock('../hooks/useShowControls', () => ({
  useShowControls: () => ({ showControls: true, handleMouseMove: () => {}, handleMouseLeave: () => {} }),
}));
vi.mock('../hooks/useTime', () => ({ useTime: () => () => '12:34' }));

import FocusApp from '../FocusApp';
import { useToast } from '@/hooks/use-toast';

describe('FocusApp integration', () => {
  it('starts pomodoro on click and shows Timer', async () => {
    // Prepare mocked toast
    const toastMock = vi.fn();
    (useToast as vi.Mock).mockReturnValue({ toast: toastMock });
    const user = userEvent.setup({ delay: 0 });

    act(() => {
      render(<FocusApp />);
    });
    // IdleMode should show Pomodoro button
    const pomodoroBtn = screen.getByText('Pomodoro Focus');
    await user.click(pomodoroBtn);
    // toast should be called with Pomodoro Started
    expect(toastMock).toHaveBeenCalledWith({
      title: 'Pomodoro Started',
      description: '25 minutes of focus time. You can do it!',
    });
    // Timer title should appear
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
    // Cancel returns to idle
    const cancelBtn = screen.getByText('Cancel');
    await user.click(cancelBtn);
    expect(screen.getByText('Pomodoro Focus')).toBeInTheDocument();
  });
  it('loads saved task from localStorage and updates it on change', async () => {
    // Pre-populate localStorage
    localStorage.setItem('focusTask', 'Saved Task');
    const toastMock = vi.fn();
    (useToast as vi.Mock).mockReturnValue({ toast: toastMock });
    const user = userEvent.setup({ delay: 0 });
    act(() => {
      render(<FocusApp />);
    });
    // TaskInput should display saved task
    const input = screen.getByPlaceholderText(/main goal for today/i) as HTMLInputElement;
    expect(input.value).toBe('Saved Task');
    // Type additional text
    await user.type(input, ' A');
    expect(localStorage.getItem('focusTask')).toBe('Saved Task A');
  });
});