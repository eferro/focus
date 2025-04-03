
import { useState, useEffect, useRef } from 'react';

// Audio sources - in a real app, these would be actual audio files
const audioSources = {
  rain: "https://example.com/rain.mp3",
  forest: "https://example.com/forest.mp3",
  white: "https://example.com/white-noise.mp3",
  waves: "https://example.com/ocean.mp3",
};

type AudioType = keyof typeof audioSources;

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [type, setType] = useState<AudioType>('rain');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;
    
    // Use a placeholder audio if real audio files aren't available
    audio.src = audioSources[type] || 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Change audio source when type changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = audioSources[type] || 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [type]);
  
  // Control playback
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.log('Error playing audio:', err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const changeType = (newType: AudioType) => {
    setType(newType);
  };
  
  return {
    isPlaying,
    currentType: type,
    togglePlayback,
    changeType,
  };
}
