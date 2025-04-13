import softRain from './soft-rain-ambient-111154.mp3';
import oceanWaves from './ocean-waves-112906.mp3';
import forestAmbience from './forest-with-small-river-birds-and-nature-field-recording-6735.mp3';

export interface SoundOption {
  id: string;
  name: string;
  src: string;
  icon: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'soft-rain',
    name: 'Soft Rain',
    src: softRain,
    icon: '🌧️'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    src: oceanWaves,
    icon: '🌊'
  },
  {
    id: 'forest-ambience',
    name: 'Forest Ambience',
    src: forestAmbience,
    icon: '🌳'
  }
] as const; 