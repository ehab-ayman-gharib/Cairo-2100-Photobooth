import { EraData, EraId } from './types';

/**
 * IDENTITY_PRESERVATION_GUIDE:
 * These instructions ensure Gemini 3 Flash Image maintains the user's likeness 
 * while accurately rendering the complex textures of Egyptian heritage materials.
 */
export const IDENTITY_PRESERVATION_GUIDE = `REQUIREMENTS:
- CRITICAL: Maintain exact facial features, bone structure, and skin tone. No facial morphing.
- Wardrobe: Replace current clothing with high-end Neo-Egyptian fashion using heavy-weight Egyptian linen, structured silk, and matte metallic accents.
- Style: Hyper-realistic commercial photography, 8k resolution, shot on 35mm lens, f/1.8 for slight background bokeh.
- Lighting: Volumetric "Golden Hour" sunlight mixed with localized neon glows; ensure light wraps realistically around the subject's silhouette.`;



/**
 * WARDROBE_STYLES:
 * Shifted away from Asian tech-wear toward "Smart-Heritage" 
 * utilizing Egyptian cotton, linen, and traditional embroidery.
 */
export const WARDROBE_STYLES = [
  "A tailored linen blazer in desert-sand, featuring subtle geometric 'Suna' patterns embroidered with refined copper thread along the lapels.",
  "A structured silk vest in deep indigo, featuring a minimalist high-collar and fine amber-beaded trim along the seams.",
  "A sharp-cut cotton duster coat with 'Mashrabiya' laser-etched patterns on the shoulders, paired with a sleek monochromatic turtleneck.",
  "A modern draped wrap-jacket made of high-end Egyptian cotton, featuring subtle metallic gold hieroglyphs woven directly into the fabric.",
  "Sophisticated urban Cairene attire: a structured linen utility-jacket with polished turquoise-and-copper button accents and a slim, modern silhouette."
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
    promptInstructions: 'Deep perspective shot of a narrow Khan el-Khalili alley. The limestone walls are weathered and ancient. Thousands of floating, bioluminescent copper lanterns create a "sea of stars" overhead. Warm amber light bounces off damp cobblestones and intricate wooden Mashrabiya windows. The air is thick with a golden, dusty haze.'
  },
  {
    id: EraId.TAHRIR,
    name: 'Tahrir Square',
    nameAr: 'ميدان التحرير',
    description: 'The pulse of Neo-Cairo.',
    promptInstructions: 'A grand cinematic view of Tahrir Square at dusk. The central Obelisk is a skyscraper-sized pillar of light. The surrounding circular roads are ribbons of glowing neon purple and blue. The red facade of the Egyptian Museum is illuminated by massive floating holographic projections of Tutankhamun’s mask.'
  },
  {
    id: EraId.NILE,
    name: 'The Nile & Qasr al-Nil',
    nameAr: 'النيل وقصر النيل',
    description: 'Where the river meets the grid.',
    promptInstructions: 'Standing on the Qasr al-Nil bridge. The heavy black steel rivets are traced with glowing teal LED lines. The iconic bronze lions have subtle amber ocular sensors. The Nile river below flows like dark liquid mercury, reflecting a massive holographic moon and the neon skyline of the Cairo Tower.'
  },
  {
    id: EraId.DOWNTOWN,
    name: 'Downtown (Khedivial Cairo)',
    nameAr: 'وسط البلد الخديوية',
    description: 'Belle Époque architecture reimagined.',
    promptInstructions: 'A vibrant street scene at Talaat Harb Square. Ornate 19th-century European-style facades are draped in vertical gardens and floating intricate heritage calligraphy neon signs. Retro-futuristic hover-taxis glide between the French-style balconies. The lighting is high-contrast, moody, and sophisticated.'
  },
  {
    id: EraId.TOWER,
    name: 'Cairo Tower',
    nameAr: 'برج القاهرة',
    description: 'The Lotus of the Future.',
    promptInstructions: 'A vertical composition looking up at the Cairo Tower. The concrete lotus mesh is filled with translucent smart-glass panels that change color. The base of the tower is surrounded by a dense solarpunk forest on Gezira Island, with glowing tropical flora and white maglev tracks winding through the palm trees.'
  }
];