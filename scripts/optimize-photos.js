import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PHOTO_ROTATIONS } from './photo-rotations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(process.cwd(), '@photos');
const OPTIMIZED_DIR = path.join(process.cwd(), 'public/photos');

async function optimizePhoto(filename) {
  const inputPath = path.join(PHOTOS_DIR, filename);
  const outputPath = path.join(OPTIMIZED_DIR, filename.replace('.jpg', '.webp'));
  
  try {
    // Get original metadata and dimensions
    const stats = await sharp(inputPath).metadata();
    console.log(`Processing ${filename} (${stats.width}x${stats.height})...`);
    
    // Create sharp instance with auto-orientation
    let sharpInstance = sharp(inputPath).rotate();

    // Apply manual rotation if specified
    const manualRotation = PHOTO_ROTATIONS[filename];
    if (manualRotation) {
      console.log(`Applying manual rotation of ${manualRotation}° to ${filename}`);
      sharpInstance = sharpInstance.rotate(manualRotation);
    }
    
    // Apply resize and optimization
    await sharpInstance
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const optimizedStats = await sharp(outputPath).metadata();
    console.log(`✅ Optimized: ${filename} -> ${optimizedStats.width}x${optimizedStats.height}`);
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error);
  }
}

async function main() {
  // Create optimized directory if it doesn't exist
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  // Get all jpg files
  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(file => file.endsWith('.jpg'))
    .sort(); // Sort to process in order

  console.log(`Found ${files.length} photos to optimize...`);

  // Process each file
  for (const file of files) {
    await optimizePhoto(file);
  }

  console.log('Optimization complete!');
}

main().catch(console.error); 