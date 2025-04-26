import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IdleMode from '../components/IdleMode';

// Mock TaskInput to avoid unrelated complexity
vi.mock('../components/TaskInput', () => ({
  __esModule: true,
  default: ({ value, onChange, ...props }: any) => (
    <input
      data-testid="task-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  ),
}));

describe('IdleMode', () => {
  it('renders greeting, task input, and both focus mode buttons', () => {
    render(
      <IdleMode
        greeting="Hello, world!"
        task="Test task"
        onTaskChange={vi.fn()}
        onStartFocus={vi.fn()}
        showControls={true}
        time={null}
        formatTime={() => '12:34'}
      />
    );

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByTestId('task-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pomodoro Focus/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Disconnection Mode/i })).toBeInTheDocument();
  });
}); 