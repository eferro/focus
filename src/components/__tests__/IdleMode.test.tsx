import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import IdleMode from '../IdleMode';

describe('IdleMode', () => {
  const onTaskChange = vi.fn();
  const onStartFocus = vi.fn();
  const formatTime = () => '08:15';
  const greeting = 'Good morning';
  const placeholder = 'What is your main goal for today?';

  beforeEach(() => {
    onTaskChange.mockClear();
    onStartFocus.mockClear();
  });

  it('renders formatted time and greeting', () => {
    render(
      <IdleMode
        greeting={greeting}
        task=""
        onTaskChange={onTaskChange}
        onStartFocus={onStartFocus}
        showControls={false}
        formatTime={formatTime}
      />
    );
    expect(screen.getByText(formatTime())).toBeInTheDocument();
    expect(screen.getByText(greeting)).toBeInTheDocument();
  });

  it('toggles controls visibility based on showControls prop', () => {
    const { rerender } = render(
      <IdleMode
        greeting={greeting}
        task=""
        onTaskChange={onTaskChange}
        onStartFocus={onStartFocus}
        showControls={false}
        formatTime={formatTime}
      />
    );
    // Controls container should be hidden
    const hiddenContainer = screen.getByText('Pomodoro Focus').parentElement?.parentElement;
    expect(hiddenContainer).toHaveClass('opacity-0');

    // When showControls is true, it should be visible
    rerender(
      <IdleMode
        greeting={greeting}
        task=""
        onTaskChange={onTaskChange}
        onStartFocus={onStartFocus}
        showControls={true}
        formatTime={formatTime}
      />
    );
    const visibleContainer = screen.getByText('Pomodoro Focus').parentElement?.parentElement;
    expect(visibleContainer).toHaveClass('opacity-100');
  });

  it('calls onStartFocus when focus buttons are clicked', async () => {
    const { user } = render(
      <IdleMode
        greeting={greeting}
        task=""
        onTaskChange={onTaskChange}
        onStartFocus={onStartFocus}
        showControls={true}
        formatTime={formatTime}
      />
    );
    const pomodoroBtn = screen.getByText('Pomodoro Focus');
    const disconnBtn = screen.getByText('Disconnection Mode');
    await user.click(pomodoroBtn);
    expect(onStartFocus).toHaveBeenCalledWith('pomodoro');
    await user.click(disconnBtn);
    expect(onStartFocus).toHaveBeenCalledWith('disconnection');
  });

  it('invokes onTaskChange when typing into the task input', async () => {
    const { user } = render(
      <IdleMode
        greeting={greeting}
        task=""
        onTaskChange={onTaskChange}
        onStartFocus={onStartFocus}
        showControls={true}
        formatTime={formatTime}
      />
    );
    const input = screen.getByPlaceholderText(placeholder);
    const text = 'Read a book';
    await user.click(input);
    await user.type(input, text);
    // Should be called once per character typed
    const calls = onTaskChange.mock.calls.map(call => call[0]);
    expect(calls).toEqual(text.split(''));
  });
});