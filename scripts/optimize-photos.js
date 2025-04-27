#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directory containing photos
const PHOTOS_DIR = path.join(process.cwd(), 'public/photos');

// Pad number to 4 digits
const pad = n => String(n).padStart(4, '0');

async function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`Directory not found: ${PHOTOS_DIR}`);
    process.exit(1);
  }
  const entries = fs.readdirSync(PHOTOS_DIR);
  // Existing webp files with pattern photo_xxxx.webp
  const existingNums = entries
    .map(name => {
      const m = name.match(/^photo_(\d{4})\.webp$/);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter(n => n !== null)
    .sort((a, b) => a - b);
  const start = existingNums.length ? existingNums[existingNums.length - 1] : 0;

  // JPEG targets
  const targets = entries.filter(name => /\.(jpe?g)$/i.test(name)).sort();
  if (targets.length === 0) {
    console.log('No JPEG files to process.');
    return;
  }
  console.log(`Found ${targets.length} JPEG(s). Starting from index ${start + 1}.`);
  let counter = start;
  for (const file of targets) {
    counter++;
    const num = pad(counter);
    const input = path.join(PHOTOS_DIR, file);
    const outName = `photo_${num}.webp`;
    const output = path.join(PHOTOS_DIR, outName);
    try {
      console.log(`Processing ${file} -> ${outName}`);
      await sharp(input)
        .rotate()
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      fs.unlinkSync(input);
    } catch (err) {
      console.error(`Error ${file}:`, err);
    }
  }
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});