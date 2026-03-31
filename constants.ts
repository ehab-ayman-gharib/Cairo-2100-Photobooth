import { EraData, EraId, PropData } from './types';

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
 * PROPS:
 * These use "Visual Anchors" like 'brushed gold' and 'liquid plasma' 
 * to leverage Gemini's sensitivity to materiality.
 */
export const PROPS: PropData[] = [
  {
    id: 'drone',
    name: 'Pet Drone',
    nameAr: 'طائرة مرافقة',
    category: 'Companion',
    icon: '🛸',
    prompt: 'A sleek, silent hovering drone at shoulder level, crafted from brushed sand-blasted gold with glowing turquoise circuitry, inspired by a stylized scarab silhouette.'
  },
  {
    id: 'energy',
    name: 'Ankh Core',
    nameAr: 'قلب الحياة',
    category: 'Handheld',
    icon: '⚡',
    prompt: 'The subject holds a translucent glass Ankh pulsing with a core of liquid blue plasma, casting a cool ambient glow onto their face and chest.'
  },
];

/**
 * WARDROBE_STYLES:
 * Shifted away from Asian tech-wear toward "Smart-Heritage" 
 * utilizing Egyptian cotton, linen, and traditional embroidery.
 */
export const WARDROBE_STYLES = [
  "A structured, heavy-linen Galabeya in desert-sand color, featuring geometric 'Suna' patterns embroidered with glowing copper-wire thread along the hem and high collar.",
  "A neo-traditional silk Kaftan in deep indigo, layered with a flexible carbon-fiber vest and glowing amber-beaded trim along the sleeves.",
  "A sharp-cut linen blazer with 'Mashrabiya' laser-cut patterns on the lapels, revealing a shimmering holographic under-layer.",
  "A modern draped Abaya made of smart-fabric that shimmers like liquid silver, featuring bioluminescent gold hieroglyphs flowing slowly across the fabric surface.",
  "High-tech Cairene ceremonial attire: a stiff linen tunic with an integrated glowing pectoral plate made of polished turquoise and weathered copper."
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
    promptInstructions: 'A vibrant street scene at Talaat Harb Square. Ornate 19th-century European-style facades are draped in vertical gardens and floating Arabic calligraphy neon signs. Retro-futuristic hover-taxis glide between the French-style balconies. The lighting is high-contrast, moody, and sophisticated.'
  },
  {
    id: EraId.TOWER,
    name: 'Cairo Tower',
    nameAr: 'برج القاهرة',
    description: 'The Lotus of the Future.',
    promptInstructions: 'A vertical composition looking up at the Cairo Tower. The concrete lotus mesh is filled with translucent smart-glass panels that change color. The base of the tower is surrounded by a dense solarpunk forest on Gezira Island, with glowing tropical flora and white maglev tracks winding through the palm trees.'
  }
];