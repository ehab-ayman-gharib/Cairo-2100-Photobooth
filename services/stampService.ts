import { EraData } from '../types';

/**
 * Applies a branding frame to the generated image.
 * Uses a single unified frame from public/Frames/Frame.png
 * Final output is 1200x1800 (2:3 aspect ratio)
 */
export const applyEraStamp = (imageSrc: string, era: EraData): Promise<string> => {
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
        const frameImg = createSafeImage('./Frames/Frame.png', true);

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

            // 1. Draw Main Image - Fill the canvas
            // AI generated image is 2:3, so it should fit perfectly.
            // We'll use "cover" logic just in case.
            const imgAspect = mainImage.width / mainImage.height;
            const canvasAspect = canvas.width / canvas.height;

            let drawWidth, drawHeight, offsetX, offsetY;
            if (imgAspect > canvasAspect) {
                // Image is wider than canvas
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgAspect;
                offsetX = -(drawWidth - canvas.width) / 2;
                offsetY = 0;
            } else {
                // Image is taller than canvas
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
                offsetX = 0;
                offsetY = -(drawHeight - canvas.height) / 2;
            }

            ctx.drawImage(mainImage, offsetX, offsetY, drawWidth, drawHeight);

            // 2. Draw Frame - Over everything
            // The Frame.png should be 1200x1800 with transparency for the photo area
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            // 3. Draw Randomized Tagline - Above the banner line
            const taglines = [
                "From Papyrus to Pixels",
                "The future is old soul, new energy",
                "Reality, but better. Cairo 2100"
            ];
            const text = taglines[Math.floor(Math.random() * taglines.length)].toUpperCase();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px "Lalezar", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';

            // Coordinates based on 1200x1800 canvas with bottom banner
            // We align it to the left side of the banner above the horizontal line
            const textX = 77;
            const textY = 1570; // Slightly above the line (estimated line position)

            ctx.fillText(text, textX, textY);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
    });
};
