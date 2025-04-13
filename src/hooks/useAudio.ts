
import { useState, useEffect, useRef } from 'react';

// Audio sources - using reliable sources from Pixabay (royalty free)
const audioSources = {
  rain: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749dcbc.mp3?filename=rain-and-thunder-16705.mp3", // Rain sound
  forest: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_b893d2d55d.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3", // Forest ambience
  white: "https://cdn.pixabay.com/download/audio/2021/08/08/audio_545faf6b2a.mp3?filename=white-noise-6471.mp3", // White noise
  waves: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1ed1a45a0.mp3?filename=ocean-waves-112906.mp3", // Ocean waves
};

type AudioType = keyof typeof audioSources;

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [type, setType] = useState<AudioType>('rain');
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Create audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    
    // Set initial source
    audio.src = audioSources[type];
    
    // Handle loading errors
    audio.addEventListener('error', (e) => {
      console.error(`Failed to load audio: ${audio.src}`, e);
      setAudioLoaded(false);
    });
    
    // Handle successful loading
    audio.addEventListener('canplaythrough', () => {
      console.log(`Audio loaded successfully: ${audio.src}`);
      setAudioLoaded(true);
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('error', () => {});
      audio.removeEventListener('canplaythrough', () => {});
    };
  }, []);
  
  // Change audio source when type changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      setAudioLoaded(false);
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
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log('Audio playback started successfully');
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            
            // Try to play again with user interaction (often resolves autoplay issues)
            const handleDocumentClick = () => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Audio playback started successfully after user interaction');
                    document.removeEventListener('click', handleDocumentClick);
                  })
                  .catch(innerErr => {
                    console.error('Error playing audio even after user interaction:', innerErr);
                  });
              }
            };
            
            document.addEventListener('click', handleDocumentClick, { once: true });
            console.log('Added click listener to enable audio after user interaction');
          });
      }
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
    togglePlayback,
    changeType,
    adjustVolume,
  };
}
