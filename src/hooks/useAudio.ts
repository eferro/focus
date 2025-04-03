
import { useState, useEffect, useRef } from 'react';

// Create base64 encoded audio for testing purposes in case the real audio fails to load
// This is a minimal audio file that should work in all browsers
const silentAudioBase64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// Audio sources - using real creative commons audio files that are freely available
const audioSources = {
  rain: "https://freesound.org/data/previews/346/346170_5121236-lq.mp3", // Rain sound
  forest: "https://freesound.org/data/previews/366/366818_5995243-lq.mp3", // Forest ambience
  white: "https://freesound.org/data/previews/523/523487_4977255-lq.mp3", // White noise
  waves: "https://freesound.org/data/previews/338/338134_5121236-lq.mp3", // Ocean waves
};

type AudioType = keyof typeof audioSources;

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [type, setType] = useState<AudioType>('rain');
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    
    // Set initial source
    audio.src = audioSources[type];
    
    // Handle loading errors by falling back to silent audio
    audio.addEventListener('error', () => {
      console.warn(`Failed to load audio: ${audio.src}, falling back to silent audio`);
      audio.src = silentAudioBase64;
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('error', () => {});
    };
  }, []);
  
  // Change audio source when type changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = audioSources[type];
      
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [type]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Control playback
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log('Audio playback started successfully');
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
          
          // Try with silent audio as a last resort
          if (audioRef.current) {
            audioRef.current.src = silentAudioBase64;
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
                console.log('Silent audio playback started as fallback');
              })
              .catch(silentErr => {
                console.error('Even silent audio failed to play:', silentErr);
              });
          }
        });
    }
  };
  
  const changeType = (newType: AudioType) => {
    setType(newType);
  };
  
  const adjustVolume = (newVolume: number) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };
  
  return {
    isPlaying,
    currentType: type,
    volume,
    togglePlayback,
    changeType,
    adjustVolume,
  };
}
