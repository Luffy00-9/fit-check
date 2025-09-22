import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Replaced `never` with `undefined` in the OutfitInput type to make it compatible
// with object literals created at call sites. This resolves the TypeScript error in App.tsx
// without compromising type safety within this service.
type OutfitInput = {
    description: string;
    image?: undefined;
} | {
    description?: undefined;
    image: {
        base64: string;
        mimeType: string;
    }
}

/**
 * Uses Gemini to edit an image based on a text prompt for outfit and background.
 * @param base64ImageData The base64 encoded string of the user's image.
 * @param mimeType The MIME type of the user's image.
 * @param outfit The outfit description or image.
 * @param backgroundPrompt The text description of the desired background.
 * @returns A promise that resolves to a GeneratedImage object.
 */
export const editImageWithOutfit = async (
  base64ImageData: string,
  mimeType: string,
  outfit: OutfitInput,
  backgroundPrompt: string
): Promise<GeneratedImage> => {
  try {
    const parts: any[] = [
        {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        }
    ];

    let fullPrompt: string;

    if (outfit.image) {
        parts.push({
            inlineData: {
                data: outfit.image.base64,
                mimeType: outfit.image.mimeType,
            },
        });
        fullPrompt = `Using the second image as a reference for the outfit, re-render the person in the first image wearing those clothes. Maintain the person's face and body.`;
    } else {
        fullPrompt = `Re-render this person wearing the following outfit: ${outfit.description}. Maintain the person's face and body.`;
    }

    if (backgroundPrompt.trim()) {
      fullPrompt += ` Place them in the following background: ${backgroundPrompt}.`;
    } else if (outfit.image) {
        fullPrompt += ` Maintain the background from the first image.`;
    } else {
        fullPrompt += ` Maintain the background. Only change the clothes.`;
    }
    
    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response candidates found from the API. The request may have been blocked.");
    }

    const generatedImage: GeneratedImage = { imageUrl: '', text: null };
    let imageFound = false;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        generatedImage.imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        imageFound = true;
      } else if (part.text) {
        generatedImage.text = part.text;
      }
    }
    
    if (!imageFound) {
      throw new Error("API response did not contain an image. It might have been blocked due to safety policies.");
    }
    
    return generatedImage;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};