import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundCanvas from '../components/BackgroundCanvas';

// Mock the useBackgroundSound hook
vi.mock('../hooks/useBackgroundSound', () => ({
  useBackgroundSound: () => ({
    isPlaying: false,
    volume: 50,
    currentSound: { id: 'rain', name: 'Rain', path: '/sounds/rain.mp3' },
    sounds: [{ id: 'rain', name: 'Rain', path: '/sounds/rain.mp3' }],
    togglePlayback: vi.fn(),
    adjustVolume: vi.fn(),
    changeSound: vi.fn(),
  }),
}));

describe('BackgroundCanvas', () => {
  const defaultProps = {
    onMouseMove: vi.fn(),
    onMouseLeave: vi.fn(),
    children: <div>Test Content</div>,
  };

  it('renders without crashing', () => {
    render(<BackgroundCanvas {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the footer with correct link', () => {
    render(<BackgroundCanvas {...defaultProps} />);
    const link = screen.getByText(/Made with ❤️ by eferro/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.eferro.net');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onMouseMove when mouse moves', async () => {
    const user = userEvent.setup();
    render(<BackgroundCanvas {...defaultProps} />);
    
    const container = screen.getByTestId('background-canvas');
    await user.hover(container);
    
    expect(defaultProps.onMouseMove).toHaveBeenCalled();
  });

  it('calls onMouseLeave when mouse leaves', () => {
    render(<BackgroundCanvas {...defaultProps} />);
    const container = screen.getByTestId('background-canvas');
    fireEvent.mouseLeave(container);
    expect(defaultProps.onMouseLeave).toHaveBeenCalled();
  });
}); 