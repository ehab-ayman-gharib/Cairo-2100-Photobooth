import { EraData } from '../types';

/**
 * Applies a branding frame to the generated image.
 * Randomizes between multiple frames in public/Frames
 * Final output is 1200x1800 (2:3 aspect ratio)
 */

let lastFrameIndex = -1;
const AVAILABLE_FRAMES = [
    './Frames/Frame_0.png',
    './Frames/Frame_1.png',
    './Frames/Frame_2.png'
];
export const applyEraStamp = (imageSrc: string, era: EraData, forPrinting: boolean = true): Promise<string> => {
    return new Promise((resolve) => {
        let assetsLoaded = 0;
        const totalAssets = 2; // Main Image + Frame Overlay

        const onAssetLoad = () => {
            assetsLoaded++;
            if (assetsLoaded === totalAssets) {
                processComposition();
            }
        };

        const createSafeImage = (src: string, isEssential = false) => {
            const img = new Image();
            if (!src.startsWith('data:')) {
                img.crossOrigin = "anonymous";
            }
            img.onload = onAssetLoad;
            img.onerror = (err) => {
                console.error(`[Composition] Failed to load image: ${src}`, err);
                if (isEssential) {
                    resolve(imageSrc);
                } else {
                    onAssetLoad();
                }
            };
            img.src = src;
            return img;
        };

        const mainImage = createSafeImage(imageSrc, true);
        
        // Randomize frame without consecutive repeats
        let frameIndex;
        if (AVAILABLE_FRAMES.length > 1) {
            do {
                frameIndex = Math.floor(Math.random() * AVAILABLE_FRAMES.length);
            } while (frameIndex === lastFrameIndex);
        } else {
            frameIndex = 0;
        }
        lastFrameIndex = frameIndex;
        
        const frameImg = createSafeImage(AVAILABLE_FRAMES[frameIndex], true);

        const processComposition = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(imageSrc);
                return;
            }

            // Final Result Size: 1200 x 1800 (2:3 aspect ratio)
            canvas.width = 1200;
            canvas.height = 1800;

            // SELPHY Strategy: 
            // - Top Margin: 90px (Increase to clear printer crop @ top)
            // - Bottom Margin: 40px (Confirmed for SELPHY alignment)
            const topMargin = forPrinting ? 70 : 0;
            const bottomMargin = forPrinting ? 40 : 0;
            const safeH = 1800 - topMargin - bottomMargin;

            // 0. Fill Background with Black (Margins)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Main Image - Compressed into safe area
            const imgAspect = mainImage.width / mainImage.height;
            const targetAspect = canvas.width / safeH;

            let drawWidth, drawHeight, offsetX, offsetY;
            if (imgAspect > targetAspect) {
                drawHeight = safeH;
                drawWidth = safeH * imgAspect;
                offsetX = -(drawWidth - canvas.width) / 2;
                offsetY = topMargin;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
                offsetX = 0;
                offsetY = topMargin - (drawHeight - safeH) / 2;
            }

            // Clip drawing to safe area
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, topMargin, canvas.width, safeH);
            ctx.clip();
            ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);
            ctx.restore();

            // 2. Draw Frame - Over safe area
            ctx.drawImage(frameImg, 0, topMargin, canvas.width, safeH);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
    });
};
