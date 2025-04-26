import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AudioControl from '../AudioControl';
import type { SoundOption } from '@/assets/audio';

describe('AudioControl', () => {
  const sounds: SoundOption[] = [
    { id: 'a', icon: '🔔', name: 'Bell' },
    { id: 'b', icon: '🐶', name: 'Dog' },
  ];
  const currentSound = sounds[0];
  let onToggle: ReturnType<typeof vi.fn>;
  let onVolumeChange: ReturnType<typeof vi.fn>;
  let onSoundChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onToggle = vi.fn();
    onVolumeChange = vi.fn();
    onSoundChange = vi.fn();
  });

  it('renders correct volume icon based on isPlaying and calls onToggle', async () => {
    const user = userEvent.setup({ delay: 0 });
    // When not playing, show unmute (volume off) button
    const { rerender } = render(
      <AudioControl
        isPlaying={false}
        volume={0.5}
        currentSound={currentSound}
        sounds={sounds}
        onToggle={onToggle}
        onVolumeChange={onVolumeChange}
        onSoundChange={onSoundChange}
      />
    );
    // VolumeX icon has svg title or fallback role
    const unmuteButton = screen.getByRole('button', { name: /unmute audio/i });
    expect(unmuteButton).toBeInTheDocument();
    await user.click(unmuteButton);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // When playing, show volume icon
    rerender(
      <AudioControl
        isPlaying={true}
        volume={0.5}
        currentSound={currentSound}
        sounds={sounds}
        onToggle={onToggle}
        onVolumeChange={onVolumeChange}
        onSoundChange={onSoundChange}
      />
    );
    const muteButton = screen.getByRole('button', { name: /mute audio/i });
    expect(muteButton).toBeInTheDocument();
  });

  it('calls onVolumeChange when slider is adjusted', () => {
    render(
      <AudioControl
        isPlaying
        volume={0.3}
        currentSound={currentSound}
        sounds={sounds}
        onToggle={onToggle}
        onVolumeChange={onVolumeChange}
        onSoundChange={onSoundChange}
      />
    );
    const slider = screen.getByRole('slider');
    // Simulate keyboard arrow right to increase volume
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(onVolumeChange).toHaveBeenCalled();
  });

  it('passes sound change to onSoundChange', async () => {
    const user = userEvent.setup({ delay: 0 });
    render(
      <AudioControl
        isPlaying
        volume={0.3}
        currentSound={currentSound}
        sounds={sounds}
        onToggle={onToggle}
        onVolumeChange={onVolumeChange}
        onSoundChange={onSoundChange}
      />
    );
    // Open SoundSelector (trigger button has 'Change sound' aria-label)
    const trigger = screen.getByRole('button', { name: /change sound/i });
    await user.click(trigger);
    // Select second sound
    const option = await screen.findByText(sounds[1].name);
    await user.click(option);
    expect(onSoundChange).toHaveBeenCalledWith(sounds[1].id);
  });
});