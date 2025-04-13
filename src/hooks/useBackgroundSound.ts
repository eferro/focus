import { useState, useEffect, useRef } from 'react';
import { SOUND_OPTIONS, type SoundOption } from '../assets/audio';

export function useBackgroundSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default volume at 30%
  const [currentSoundId, setCurrentSoundId] = useState(SOUND_OPTIONS[0].id);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSound = SOUND_OPTIONS.find(sound => sound.id === currentSoundId)!;

  useEffect(() => {
    // Create audio element
    const audio = new Audio(currentSound.src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // If it was playing before changing sound, start playing the new sound
    if (isPlaying) {
      audio.play().catch(console.error);
    }

    // Cleanup on unmount or sound change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSound, volume, isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Create a new AudioContext to handle autoplay restrictions
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.resume().then(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error('Error playing audio:', err);
            });
        }
      });
    }
  };

  const adjustVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const changeSound = (soundId: string) => {
    const sound = SOUND_OPTIONS.find(s => s.id === soundId);
    if (sound) {
      setCurrentSoundId(soundId);
    }
  };

  return {
    isPlaying,
    volume,
    currentSound,
    sounds: SOUND_OPTIONS,
    togglePlayback,
    adjustVolume,
    changeSound
  };
} 