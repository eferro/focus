// Define the type for Vite's image imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

import moraineLake from './moraine-lake.jpg';
import atlanticClouds from './atlantic-clouds.jpg';
import biandintz from './biandintz.jpg';
import bryceCanyon from './bryce-canyon.jpg';
import volcano from './volcano.jpg';

// When importing images in Vite, they are resolved to their URLs
export const NATURE_IMAGES = [
  moraineLake,
  atlanticClouds,
  biandintz,
  bryceCanyon,
  volcano
] as const;

export type NatureImage = typeof NATURE_IMAGES[number]; 