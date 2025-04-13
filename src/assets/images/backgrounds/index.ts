import moraineLake from './moraine-lake.jpg';
import atlanticClouds from './atlantic-clouds.jpg';
import biandintz from './biandintz.jpg';
import mountainLake from './mountain-lake.jpg';
import northernLights from './northern-lights.jpg';
import desertSunset from './desert-sunset.jpg';
import tropicalBeach from './tropical-beach.jpg';
import forestPath from './forest-path.jpg';

// When importing images in Vite, they are resolved to their URLs
export const NATURE_IMAGES = [
  moraineLake,
  atlanticClouds,
  biandintz,
  mountainLake,
  northernLights,
  desertSunset,
  tropicalBeach,
  forestPath
] as const;

export type NatureImage = typeof NATURE_IMAGES[number]; 