import { EraData, EraId, PropData } from './types';

export const IDENTITY_PRESERVATION_GUIDE = `REQUIREMENTS:
- KEEP the original faces and identity visible and recognizable. Do NOT alter features.
- Change clothing, hair, and accessories to be high-tech and futuristic.
- Photorealistic, high quality, 9:16 portrait.
- Lighting must be cinematic, volumetric, and natural, casting realistic shadows on the clothing layers.`;

export const PROPS: PropData[] = [
  { id: 'drone', name: 'Pet Drone', nameAr: 'طائرة مرافقة', category: 'Companion', icon: '🛸', prompt: 'with a small personal flying drone hovering near their shoulder' },
  { id: 'energy', name: 'Ankh Core', nameAr: 'قلب الحياة', category: 'Handheld', icon: '⚡', prompt: 'holding a glowing blue energy core shaped like an ancient Ankh' },
  { id: 'aura', name: 'Neural Aura', nameAr: 'هالة عصبية', category: 'Atmosphere', icon: '✨', prompt: 'surrounded by a subtle glowing pink and blue neural energy aura' },
  { id: 'wings', name: 'Digital Wings', nameAr: 'أجنحة رقمية', category: 'Back', icon: '🦋', prompt: 'with ethereal holographic digital wings made of light behind them' },
  { id: 'orbs', name: 'Floating Orbs', nameAr: 'كرات طافية', category: 'Atmosphere', icon: '🔮', prompt: 'with several small glowing holographic data orbs floating around them' },
];

export const WARDROBE_STYLES = [
  "sleek tech-wear with glowing fiber-optic patterns",
  "flowing neo-traditional Egyptian robes with metallic accents",
  "structured solar-powered armor with iridescent surfaces",
  "elegant high-fashion futuristic suit with holographic lapels",
  "cyber-streetwear with oversized glowing accessories"
];

export const ERAS: EraData[] = [
  { 
    id: EraId.TAHRIR, 
    name: 'Tahrir Square', 
    nameAr: 'ميدان التحرير',
    description: 'The heart of Cairo featuring the historic AUC Palace and the iconic red Egyptian Museum, reimagined with holographic displays.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-neon-lights-42475-large.mp4',
    overlay: 'AR_TAHRIR_GRID',
    previewImage: './Landmarks/Tahrir-Preview.png',
    stamps: [],
    frames: [],
    promptInstructions: 'Specifically, include the historic AUC Tahrir Square Main Building (the Palace) AND the iconic red Egyptian Museum building. Both should be enhanced with futuristic elements like glowing holographic banners and vertical greenery.'
  },
  { 
    id: EraId.NILE, 
    name: 'The Nile & Qasr al-Nil', 
    nameAr: 'النيل وقصر النيل',
    description: 'The iconic Qasr al-Nil Bridge with its famous bronze lions and futuristic feluccas with solar sails on a glowing Nile.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-rain-42476-large.mp4',
    overlay: 'AR_NILE_FLOW',
    previewImage: './Landmarks/Nile-Preview.png',
    stamps: [],
    frames: [],
    promptInstructions: 'The person should be near the Qasr al-Nil Bridge. Include the iconic bronze LION statues at the bridge entrance, enhanced with glowing cybernetic details. Show futuristic felucca boats with solar sails on the bioluminescent Nile river.'
  },
  { 
    id: EraId.DOWNTOWN, 
    name: 'Downtown & Statues', 
    nameAr: 'وسط البلد والتماثيل',
    description: 'Cyberpunk streets featuring the Talaat Harb statue and the Nahdet Misr monument, enhanced with digital energy.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-at-night-42477-large.mp4',
    overlay: 'AR_DOWNTOWN_HOLO',
    previewImage: './Landmarks/Downtown-Preview.png',
    stamps: [],
    frames: [],
    promptInstructions: 'Include the iconic Talaat Harb statue in the center of a futuristic downtown square. Also incorporate the Nahdet Misr (Egypt\'s Renaissance) statue by Mahmoud Mokhtar in the background, enhanced with holographic energy flows.'
  },
  { 
    id: EraId.TOWER, 
    name: 'Cairo Tower', 
    nameAr: 'برج القاهرة',
    description: 'The iconic lotus tower, now a beacon of clean energy overlooking a high-tech Cairo skyline.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-futuristic-city-42474-large.mp4',
    overlay: 'AR_TOWER_BEACON',
    previewImage: './Landmarks/Tower-Preview.png',
    stamps: [],
    frames: [],
    promptInstructions: 'Include the iconic Cairo Tower (lotus shape) as a central beacon of light, overlooking a high-tech city with the Nile river visible below.'
  }
];