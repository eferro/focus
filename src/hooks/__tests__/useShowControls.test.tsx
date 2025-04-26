import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useShowControls } from '../useShowControls';

// Component to expose hook behavior
const TestComponent: React.FC = () => {
  const { showControls, handleMouseMove, handleMouseLeave } = useShowControls();
  return (
    <div>
      <span data-testid="state">{showControls.toString()}</span>
      <button data-testid="move" onClick={handleMouseMove} />
      <button data-testid="leave" onClick={handleMouseLeave} />
    </div>
  );
};

describe('useShowControls hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('initially hidden and shows on mouse move', () => {
    render(<TestComponent />);
    // initially false
    expect(screen.getByTestId('state').textContent).toBe('false');
    // trigger show
    fireEvent.click(screen.getByTestId('move'));
    expect(screen.getByTestId('state').textContent).toBe('true');
  });

  it('hides after delay on mouse leave', () => {
    render(<TestComponent />);
    // show first
    fireEvent.click(screen.getByTestId('move'));
    expect(screen.getByTestId('state').textContent).toBe('true');
    // leave hides after 3s
    fireEvent.click(screen.getByTestId('leave'));
    // still true before timeout
    expect(screen.getByTestId('state').textContent).toBe('true');
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('state').textContent).toBe('false');
  });
});