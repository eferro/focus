import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SoundSelector from '../SoundSelector';

describe('SoundSelector', () => {
  const sounds = [
    { id: '1', icon: '🔔', name: 'Bell' },
    { id: '2', icon: '🐶', name: 'Dog' },
  ];
  const currentSound = sounds[0];
  let onSoundChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSoundChange = vi.fn();
  });

  it('renders trigger button with current sound icon', () => {
    render(
      <SoundSelector
        currentSound={currentSound}
        sounds={sounds}
        onSoundChange={onSoundChange}
      />
    );
    expect(screen.getByText(currentSound.icon)).toBeInTheDocument();
    // The trigger button should have Music icon (svg)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens menu and displays all sound options', async () => {
    render(<SoundSelector currentSound={currentSound} sounds={sounds} onSoundChange={onSoundChange} />);
    const user = userEvent.setup();
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    // Menu items should be visible
    const items = await screen.findAllByRole('menuitem');
    expect(items).toHaveLength(sounds.length);
    sounds.forEach((sound, idx) => {
      expect(items[idx]).toHaveTextContent(sound.icon + sound.name);
    });
  });

  it('highlights the selected sound', async () => {
    render(<SoundSelector currentSound={currentSound} sounds={sounds} onSoundChange={onSoundChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    const items = await screen.findAllByRole('menuitem');
    // First item corresponds to currentSound and should be highlighted
    expect(items[0]).toHaveClass('bg-white/10');
  });

  it('calls onSoundChange when an option is clicked', async () => {
    render(<SoundSelector currentSound={currentSound} sounds={sounds} onSoundChange={onSoundChange} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    const items = await screen.findAllByRole('menuitem');
    // Click the second option
    await user.click(items[1]);
    expect(onSoundChange).toHaveBeenCalledWith(sounds[1].id);
  });
});