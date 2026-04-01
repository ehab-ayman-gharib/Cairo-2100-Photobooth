import { GoogleGenAI } from "@google/genai";
import { EraData, FaceDetectionResult } from '../types';
import { WARDROBE_STYLES, IDENTITY_PRESERVATION_GUIDE } from '../constants';

let lastMaleWardrobeIndex = -1;
let lastFemaleWardrobeIndex = -1;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

const DASHBOARD_API_URL = "https://ai-photobooth-dashboard.vercel.app/api/projects/168f20dc-d717-4f62-902d-db030f95bfd5/generate";

/**
 * Increments the generated images count on the dashboard
 */
const incrementGeneratedCount = async () => {
  try {
    const response = await fetch(DASHBOARD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.warn(`[Dashboard] Failed to increment count: ${response.status} ${response.statusText}`);
    } else {
      console.log('[Dashboard] Successfully incremented generation count');
    }
  } catch (error) {
    console.error('[Dashboard] Error calling increment API:', error);
  }
};

export interface GenerationResult {
  image: string;
  prompt: string;
}

export const generateHistoricalImage = async (
  base64Image: string,
  era: EraData,
  faceData: FaceDetectionResult
): Promise<GenerationResult> => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  // 1. Calculate Detailed Subject & Gender Reflection
  let subjectDescription = "";
  const parts = [];
  if (faceData.maleCount > 0) parts.push(`${faceData.maleCount} ${faceData.maleCount > 1 ? 'men' : 'man'}`);
  if (faceData.femaleCount > 0) parts.push(`${faceData.femaleCount} ${faceData.femaleCount > 1 ? 'women' : 'woman'}`);
  if (faceData.childCount > 0) parts.push(`${faceData.childCount} ${faceData.childCount > 1 ? 'children' : 'child'}`);

  if (parts.length === 0) {
    subjectDescription = faceData.totalPeople > 1 ? `a group of ${faceData.totalPeople} people` : "a person";
  } else if (faceData.totalPeople === 1) {
    subjectDescription = parts[0];
  } else {
    subjectDescription = "a group of " + parts.join(', ').replace(/, ([^,]*)$/, ' and $1');
  }

  // 2. Select Wardrobe per subject type for variety with anti-consecutive repetition
  const clothingParts: string[] = [];
  
  if (faceData.maleCount > 0) {
    let maleIndex;
    do {
      maleIndex = Math.floor(Math.random() * WARDROBE_STYLES.length);
    } while (maleIndex === lastMaleWardrobeIndex && WARDROBE_STYLES.length > 1);
    lastMaleWardrobeIndex = maleIndex;
    clothingParts.push(`the ${faceData.maleCount > 1 ? 'men' : 'man'} wearing ${WARDROBE_STYLES[maleIndex]}`);
  }

  if (faceData.femaleCount > 0) {
    let femaleIndex;
    do {
      femaleIndex = Math.floor(Math.random() * WARDROBE_STYLES.length);
    } while (femaleIndex === lastFemaleWardrobeIndex && WARDROBE_STYLES.length > 1);
    lastFemaleWardrobeIndex = femaleIndex;
    clothingParts.push(`the ${faceData.femaleCount > 1 ? 'women' : 'woman'} wearing ${WARDROBE_STYLES[femaleIndex]}`);
  }

  if (faceData.childCount > 0) {
    clothingParts.push(`the ${faceData.childCount > 1 ? 'children' : 'child'} wearing cute, age-appropriate futuristic tech-wear`);
  }
  const clothingDescription = clothingParts.join(", ");

  // 3. Construct Unified Prompt
  const prompt = `Reimagine ${subjectDescription} in an unmistakably Egyptian futuristic version of ${era.name}, Cairo, in the year 2100.
  
  CRITICAL ARCHITECTURE: The historical silhouettes, limestone textures, and ornate architectural details of ${era.name} MUST be the dominant focal point. ${era.promptInstructions}.
  
  STYLE & ATMOSPHERE: 
  - A fusion of "Ancient Soul" and "New Energy". 
  - Avoid generic cyberpunk. Instead, use a "Neo-Egyptian" aesthetic: historical stone and wood textures merged with high-tech glass and bioluminescence.
  - COLOR PALETTE: Warm ochre stone, desert gold, and deep sunset oranges, accented with cool bioluminescent cyan light ribbons.
  - LIGHTING: Set during "Maghrib" (golden hour sunset) for a warm, dramatic, and atmospheric feel.

  SUBJECT DETAILS:
  - CLOTHING: ${clothingDescription}.
  - Maintain the person's pose, likeness, and facial features.
  
  ENVIRONMENT:
  - ${era.description}. 
  - Incorporate "FUTURE CAIRO" and "AUC Tahrir 2026 CultureFest" as subtle holographic branding elements within the environment.
  - Add holographic AR overlays like intricate heritage calligraphy and geometric patterns rather than generic digital grids.

  ${IDENTITY_PRESERVATION_GUIDE}`;

  console.log("------------------- GENERATED PROMPT -------------------");
  console.log(prompt);
  console.log("--------------------------------------------------------");

  // Using raw object structure to bypass potential TS mismatches with the SDK
  const safetySettings: any[] = [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
  ];

  const requestConfig: any = {
    temperature: 0.5,
    // @ts-ignore
    imageConfig: {
      aspectRatio: "2:3"
    },
    safetySettings: safetySettings
  };

  try {
    // 4. Send to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      config: requestConfig,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            },
            { text: prompt }
          ]
        }
      ]
    });

    // Extract image from response
    const candidate = response.candidates?.[0];
    if (candidate) {
      if (candidate.finishReason !== 'STOP') {
        console.warn('Gemini Generation Warning: Finish Reason:', candidate.finishReason);
      }

      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          // Increment dashboard count after successful generation
          incrementGeneratedCount();

          return {
            image: `data:image/jpeg;base64,${part.inlineData.data}`,
            prompt: prompt
          };
        }
      }
    }

    console.error('Gemini No Image Generated. Response:', JSON.stringify(response, null, 2));
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
