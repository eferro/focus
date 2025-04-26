import React, { useEffect } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useBackgroundSound } from '../useBackgroundSound';
import { SOUND_OPTIONS } from '../../assets/audio';

// Mock Audio and AudioContext
class MockAudio {
  src = '';
  loop = false;
  volume = 1;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
}
const mockResume = vi.fn(() => Promise.resolve());
(window as any).Audio = MockAudio;
(window as any).AudioContext = vi.fn(() => ({ resume: mockResume }));

// Test component that exposes hook values and actions
const TestComponent: React.FC = () => {
  const {
    isPlaying,
    volume,
    currentSound,
    sounds,
    togglePlayback,
    adjustVolume,
    changeSound,
  } = useBackgroundSound();
  return (
    <div>
      <span data-testid="playing">{isPlaying.toString()}</span>
      <span data-testid="volume">{volume.toFixed(2)}</span>
      <span data-testid="current">{currentSound.id}</span>
      <span data-testid="count">{sounds.length}</span>
      <button onClick={() => void togglePlayback()} data-testid="toggle">toggle</button>
      <button onClick={() => adjustVolume(0.8)} data-testid="volume-btn">vol80</button>
      <button onClick={() => adjustVolume(1.5)} data-testid="volume-max">volMax</button>
      <button onClick={() => adjustVolume(-0.5)} data-testid="volume-min">volMin</button>
      <button onClick={() => changeSound(sounds[1].id)} data-testid="change">change</button>
    </div>
  );
};

describe('useBackgroundSound hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with defaults', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('playing').textContent).toBe('false');
    expect(screen.getByTestId('volume').textContent).toBe('0.30');
    expect(screen.getByTestId('current').textContent).toBe(SOUND_OPTIONS[0].id);
    expect(screen.getByTestId('count').textContent).toBe(SOUND_OPTIONS.length.toString());
  });

  it('toggles playback state', async () => {
    render(<TestComponent />);
    const btn = screen.getByTestId('toggle');
    // Start playing
    await act(() => fireEvent.click(btn));
    expect(mockResume).toHaveBeenCalled();
    expect(screen.getByTestId('playing').textContent).toBe('true');
    // Pause
    await act(() => fireEvent.click(btn));
    expect(screen.getByTestId('playing').textContent).toBe('false');
  });

  it('adjusts volume with clamping', () => {
    render(<TestComponent />);
    const btn80 = screen.getByTestId('volume-btn');
    const btnMax = screen.getByTestId('volume-max');
    const btnMin = screen.getByTestId('volume-min');
    fireEvent.click(btn80);
    expect(screen.getByTestId('volume').textContent).toBe('0.80');
    fireEvent.click(btnMax);
    expect(screen.getByTestId('volume').textContent).toBe('1.00');
    fireEvent.click(btnMin);
    expect(screen.getByTestId('volume').textContent).toBe('0.00');
  });

  it('changes current sound', () => {
    render(<TestComponent />);
    const btn = screen.getByTestId('change');
    fireEvent.click(btn);
    expect(screen.getByTestId('current').textContent).toBe(SOUND_OPTIONS[1].id);
  });
});