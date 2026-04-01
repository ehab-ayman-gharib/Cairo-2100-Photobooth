import { EraData, EraId } from './types';

/**
 * IDENTITY_PRESERVATION_GUIDE:
 * These instructions ensure Gemini 3 Flash Image maintains the user's likeness 
 * while accurately rendering the complex textures of Egyptian heritage materials.
 */
export const IDENTITY_PRESERVATION_GUIDE = `REQUIREMENTS:
- CRITICAL: Maintain exact facial features, bone structure, and skin tone. No facial morphing.
- Wardrobe: MANDATORY COMPLETE REPLACEMENT. Remove all original clothing. The subject must ONLY wear the high-quality casual attire described in the specific wardrobe selection.
- Style: Hyper-realistic commercial photography, 8k resolution, shot on 35mm lens, f/1.8 for slight background bokeh.
- Lighting: Accurate volumetric lighting that wraps realistically around the subject's silhouette according to the environmental time of day.`;

/**
 * LIGHTING_STYLES:
 * Randomized lighting conditions to provide variety across generations.
 */
export const LIGHTING_STYLES = [
  "Bright, clear Egyptian morning. Crisp, natural morning sunlight with high-clarity visibility.",
  "Warm Golden Hour. Rich, amber-toned late afternoon sunlight casting long, dramatic, and warm shadows.",
  "Soft Morning Mist. Diffused, ethereal lighting through a light morning haze, creating a soft and magical feel.",
  "High Noon Clarity. Intense, direct desert sunlight with sharp shadows and high-contrast architectural details.",
  "Vivid Afternoon. Saturated colors and sharp-focus lighting under a bright, cloudless sky.",
  "Cinematic Neo-Cairo Night. Deep indigo and midnight blue sky with vibrant glowing neon and LED illuminates reflecting off the limestone.",
  "Midnight Twilight (Blue Hour). A deep, cooling blue sky with the first city lights flickering to life, adding a high-tech glow."
];



/**
 * WARDROBE_STYLES:
 * Shifted away from Asian tech-wear toward "Smart-Heritage" 
 * utilizing Egyptian cotton, linen, and traditional embroidery.
 */
export const WARDROBE_STYLES = [
  "A clean white t-shirt paired with perfectly fitted blue denim jeans and white sneakers.",
  "A casual navy blue crew-neck sweater worn over charcoal chinos for a modern, simple look.",
  "A smart-casual grey blazer layered over a plain black t-shirt and dark trousers.",
  "A simple and elegant long-sleeved blouse in a soft lilac tone, paired with light-coloured pants.",
  "A relaxed olive green button-down shirt, worn unbuttoned over a white tee with casual jeans.",
  "A modern, minimalist solid-colored dress in a soft neutral tone with simple clean lines."
];

/**
 * ERAS:
 * Expanded landmark prompts with specific architectural depth 
 * and localized Cairene lighting environments.
 */
export const ERAS: EraData[] = [
  {
    id: EraId.KHAN,
    name: 'Khan el-Khalili',
    nameAr: 'خان الخليلي',
    description: 'A labyrinth of light and history.',
    promptInstructions: 'A cinematic view of a narrow, historic Khan el-Khalili alley. Ancient limestone walls and deep stone arches are filled with vibrant textiles and polished brass bazaar shops. The cobblestone street is clean, with subtle glowing blue LED accents tracing the edges. Looking up through the narrow gap between historic rooftops, a glowing drone light show forms complex Egyptian symbols in the sky.'
  },
  {
    id: EraId.TAHRIR,
    name: 'Tahrir Square',
    nameAr: 'ميدان التحرير',
    description: 'The pulse of Neo-Cairo.',
    promptInstructions: 'A grand cinematic view of Tahrir Square under clear skies. The central Obelisk is a skyscraper-sized pillar of light. The surrounding circular roads are ribbons of glowing neon purple and blue. The red facade of the Egyptian Museum is elegantly illuminated by architectural lighting. In the vast sky above the square, hundreds of drones form massive, glowing constellations of an Ankh and a Pharaoh mask.'
  },
  {
    id: EraId.NILE,
    name: 'The Nile & Qasr al-Nil',
    nameAr: 'النيل وقصر النيل',
    description: 'Where the river meets the grid.',
    promptInstructions: 'Standing on the Qasr al-Nil bridge under a vast, clear sky. The heavy black steel rivets are traced with glowing teal LED lines. The iconic bronze lions have subtle amber ocular sensors. The Nile river below flows like dark liquid mercury, reflecting both the neon skyline and a massive, glowing drone light show portraying an Eye of Horus in the sky.'
  },
  {
    id: EraId.DOWNTOWN,
    name: 'Downtown (Khedivial Cairo)',
    nameAr: 'وسط البلد الخديوية',
    description: 'Belle Époque architecture reimagined.',
    promptInstructions: 'A vibrant street scene at Talaat Harb Square. Ornate 19th-century European-style facades are draped in vertical gardens and subtle glowing architectural highlights. Retro-futuristic hover-taxis glide between the French-style balconies. The sky above is filled with a spectacular, glowing drone constellation formed in the shape of a Scarab.'
  },
  {
    id: EraId.TOWER,
    name: 'Cairo Tower',
    nameAr: 'برج القاهرة',
    description: 'The Lotus of the Future.',
    promptInstructions: 'A vertical composition looking up at the Cairo Tower. The concrete lotus mesh is filled with translucent smart-glass panels that change color. The base of the tower is surrounded by a dense solarpunk forest on Gezira Island, with glowing tropical flora and white maglev tracks winding through the palm trees. At the tower\'s peak, a massive, glowing drone light show forms the Eye of Horus and Lotus symbols.'
  }
];