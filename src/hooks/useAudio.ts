
import { useState, useEffect, useRef } from 'react';

// Audio sources - using direct MP3 files from more reliable sources
const audioSources = {
  rain: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3", // Rain sound
  forest: "https://assets.mixkit.co/active_storage/sfx/2526/2526-preview.mp3", // Forest ambience
  white: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3", // White noise like sounds
  waves: "https://assets.mixkit.co/active_storage/sfx/1139/1139-preview.mp3", // Ocean waves
};

type AudioType = keyof typeof audioSources;

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [type, setType] = useState<AudioType>('rain');
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Create audio element when component mounts
  useEffect(() => {
    console.log("Initializing audio system");
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    
    // Set initial source
    audio.src = audioSources[type];
    setIsLoading(true);
    
    // Handle loading errors
    const handleError = (e: Event) => {
      console.error(`Failed to load audio: ${audio.src}`, e);
      setAudioLoaded(false);
      setIsLoading(false);
      setAudioError(`Failed to load ${type} sound`);
    };
    
    // Handle successful loading
    const handleLoaded = () => {
      console.log(`Audio loaded successfully: ${audio.src}`);
      setAudioLoaded(true);
      setIsLoading(false);
      setAudioError(null);
    };
    
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleLoaded);
    
    // Try to load the audio
    audio.load();
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleLoaded);
    };
  }, []);
  
  // Change audio source when type changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      setIsLoading(true);
      setAudioLoaded(false);
      setAudioError(null);
      
      console.log(`Changing audio source to: ${type}`);
      audioRef.current.src = audioSources[type];
      
      // Preload audio
      audioRef.current.load();
      
      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Error playing audio after source change:', err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [type]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      console.log(`Volume adjusted to: ${volume}`);
    }
  }, [volume]);
  
  // Control playback
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('Audio playback paused');
    } else {
      console.log('Attempting to play audio:', audioRef.current.src);
      
      // Implementation to handle autoplay restrictions
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      context.resume().then(() => {
        console.log('AudioContext resumed successfully');
        
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                console.log('Audio playback started successfully');
              })
              .catch(err => {
                console.error('Error playing audio:', err);
                setAudioError("Playback failed - try clicking again");
                
                // Try to play again with user interaction (often resolves autoplay issues)
                const handleDocumentClick = () => {
                  if (audioRef.current) {
                    // Create new audio context on user interaction
                    const newContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    newContext.resume().then(() => {
                      if (audioRef.current) {
                        audioRef.current.play()
                          .then(() => {
                            setIsPlaying(true);
                            setAudioError(null);
                            console.log('Audio playback started after user interaction');
                            document.removeEventListener('click', handleDocumentClick);
                          })
                          .catch(innerErr => {
                            console.error('Error playing audio even after user interaction:', innerErr);
                            setAudioError("Browser blocked audio - check settings");
                          });
                      }
                    });
                  }
                };
                
                document.addEventListener('click', handleDocumentClick, { once: true });
                console.log('Added click listener to enable audio after user interaction');
              });
          }
        }
      });
    }
  };
  
  const changeType = (newType: AudioType) => {
    console.log(`Changing audio type to: ${newType}`);
    setType(newType);
  };
  
  const adjustVolume = (newVolume: number) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    console.log(`Adjusted volume to: ${clampedVolume}`);
  };
  
  return {
    isPlaying,
    currentType: type,
    volume,
    audioLoaded,
    isLoading, 
    audioError,
    togglePlayback,
    changeType,
    adjustVolume,
  };
}
