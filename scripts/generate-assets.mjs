import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateAssets() {
    const publicDir = join(__dirname, '..', 'public');
    
    // Generate icons
    const iconSizes = [192, 512];
    for (const size of iconSizes) {
        await sharp(join(publicDir, 'icon.svg'))
            .resize(size, size)
            .png()
            .toFile(join(publicDir, `icon-${size}.png`));
        console.log(`Generated icon-${size}.png`);
    }

    // Generate splash screens
    const splashSizes = [
        { width: 1290, height: 2796 }, // iPhone 14 Pro Max
        { width: 1179, height: 2556 }, // iPhone 14 Pro
        { width: 1284, height: 2778 }, // iPhone 13 Pro Max
        { width: 1170, height: 2532 }, // iPhone 13/13 Pro
        { width: 1125, height: 2436 }  // iPhone X/XS
    ];

    for (const size of splashSizes) {
        await sharp(join(publicDir, 'splash.svg'))
            .resize(size.width, size.height)
            .png()
            .toFile(join(publicDir, `splash-${size.width}x${size.height}.png`));
        console.log(`Generated splash-${size.width}x${size.height}.png`);
    }
}

generateAssets().catch(console.error);
