import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputIcon = path.resolve(__dirname, '../public/icon.PNG')
const publicDir = path.resolve(__dirname, '../public')

async function generateIcons() {
  console.log('Generating PWA icons with padding to preserve logo curves from:', inputIcon)

  if (!fs.existsSync(inputIcon)) {
    console.error('Error: input icon file not found at:', inputIcon)
    return
  }

  // Transparent background for padding
  const transparentBg = { r: 0, g: 0, b: 0, alpha: 0 }

  // 192x192 standard icon (contains full curves with padding)
  await sharp(inputIcon)
    .resize(160, 160, { fit: 'contain', background: transparentBg })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'))
  console.log('✓ Generated pwa-192x192.png with curve margin')

  // 512x512 standard icon (contains full curves with padding)
  await sharp(inputIcon)
    .resize(430, 430, { fit: 'contain', background: transparentBg })
    .extend({
      top: 41,
      bottom: 41,
      left: 41,
      right: 41,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'))
  console.log('✓ Generated pwa-512x512.png with curve margin')

  // Apple touch icon 180x180
  await sharp(inputIcon)
    .resize(150, 150, { fit: 'contain', background: transparentBg })
    .extend({
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('✓ Generated apple-touch-icon.png with curve margin')

  // Maskable 512x512 icon
  await sharp(inputIcon)
    .resize(400, 400, { fit: 'contain', background: transparentBg })
    .extend({
      top: 56,
      bottom: 56,
      left: 56,
      right: 56,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'))
  console.log('✓ Generated pwa-maskable-512x512.png with curve margin')

  // Favicon 32x32 & fav.png
  await sharp(inputIcon)
    .resize(28, 28, { fit: 'contain', background: transparentBg })
    .extend({
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'))

  await sharp(inputIcon)
    .resize(28, 28, { fit: 'contain', background: transparentBg })
    .extend({
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'fav.png'))
  console.log('✓ Generated fav.png with curve margin')

  // icon.png (192x192 padded icon for app banner)
  await sharp(inputIcon)
    .resize(160, 160, { fit: 'contain', background: transparentBg })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: transparentBg,
    })
    .png()
    .toFile(path.join(publicDir, 'icon.png'))
  console.log('✓ Generated icon.png with curve margin')

  console.log('All PWA icons generated with beautiful curved design breathing room!')
}

generateIcons().catch(console.error)
