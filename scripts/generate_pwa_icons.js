const path = require('path');
const fs = require('fs');

let sharp;
try {
  sharp = require(path.resolve(__dirname, '../../nakit/node_modules/sharp'));
} catch (e) {
  try {
    sharp = require('sharp');
  } catch (err) {
    console.error('Sharp not found');
    process.exit(1);
  }
}

const inputSvg = path.join(__dirname, '../public/bjk-logo.svg');
const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../src/app');

async function generate() {
  console.log('Generating Beşiktaş PWA icons from SVG...');

  // 1. icon-192x192.png
  await sharp(inputSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192x192.png'));
  console.log('Created public/icon-192x192.png');

  // 2. icon-512x512.png
  await sharp(inputSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512x512.png'));
  console.log('Created public/icon-512x512.png');

  // 3. icon-512x512-maskable.png
  const innerSize = 390;
  const padding = Math.floor((512 - innerSize) / 2);
  const innerBuffer = await sharp(inputSvg)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#0a0a0a',
    },
  })
    .composite([{ input: innerBuffer, top: padding, left: padding }])
    .png()
    .toFile(path.join(publicDir, 'icon-512x512-maskable.png'));
  console.log('Created public/icon-512x512-maskable.png');

  // 4. apple-touch-icon.png (180x180)
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // 5. Update src/app/apple-icon.png & src/app/icon.png
  await sharp(inputSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  await sharp(inputSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('Updated src/app/apple-icon.png and src/app/icon.png');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
