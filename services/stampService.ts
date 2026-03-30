import { EraData } from '../types';

/**
 * Applies a branding frame to the generated image.
 * Uses a single unified frame from public/Frames/Frame.png
 * Final output is 1200x1800 (2:3 aspect ratio)
 */
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

            // Coordinates based on the safe area
            const textX = 77;
            // The banner is in the frame, which is now at y=topMargin.
            // Original Y was 1570 (relative to 1800).
            // Relative to 0 in frame, it's 1570 / 1800 * 1800 = 1570... 
            // Wait, if frameImg is stretched to safeH, we scale the Y coordinate.
            const scaleY = safeH / 1800;
            const textY = topMargin + (1570 * scaleY);

            ctx.fillText(text, textX, textY);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
    });
};
