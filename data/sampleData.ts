import type { OutfitSuggestion, SceneSuggestion } from '../types';

export interface SampleModel {
  id: string;
  name: string;
  gender: string;
  previewUrl: string;
  description: string;
}

export const SAMPLE_MODELS: SampleModel[] = [
  {
    id: 'model-female-full',
    name: 'Elena (Studio)',
    gender: 'Female',
    previewUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    description: 'Full body neutral studio portrait'
  },
  {
    id: 'model-male-smart',
    name: 'Marcus (Casual)',
    gender: 'Male',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Smart portrait lighting'
  },
  {
    id: 'model-female-editorial',
    name: 'Sophia (Editorial)',
    gender: 'Female',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'High fashion portrait'
  }
];

export const OUTFIT_PRESETS: OutfitSuggestion[] = [
  {
    id: 'outfit-1',
    title: 'Tailored Italian Suit',
    category: 'Professional',
    prompt: 'a charcoal gray double-breasted wool suit with structured shoulders, crisp white dress shirt, silk navy tie, and polished leather Oxfords',
  },
  {
    id: 'outfit-2',
    title: 'Haute Couture Gala Dress',
    category: 'Evening',
    prompt: 'an elegant floor-length emerald green silk gown with a thigh slit, subtle shimmer detail, and delicate silver heels',
  },
  {
    id: 'outfit-3',
    title: 'Minimalist Streetwear',
    category: 'Casual',
    prompt: 'an oversized beige heavyweight hoodie, washed black cargo pants, white vintage chunky sneakers, and a subtle silver chain necklace',
  },
  {
    id: 'outfit-4',
    title: 'Classic Parisian Trench',
    category: 'Professional',
    prompt: 'a double-breasted camel trench coat layered over a black turtleneck sweater, tailored black trousers, and leather chelsea boots',
  },
  {
    id: 'outfit-5',
    title: 'Cyberpunk Techwear',
    category: 'Avant-Garde',
    prompt: 'a futuristic matte black waterproof jacket with subtle reflective accents, tactical utility harness, dark tapered joggers, and futuristic high-top boots',
  },
  {
    id: 'outfit-6',
    title: 'Summer Resort Linen',
    category: 'Casual',
    prompt: 'a crisp white relaxed linen button-down shirt paired with beige linen trousers and handcrafted leather woven loafers',
  }
];

export const SCENE_PRESETS: SceneSuggestion[] = [
  {
    id: 'scene-1',
    title: 'Minimalist Fashion Studio',
    prompt: 'a sleek minimalist fashion photography studio with soft neutral seamless background and professional softbox lighting',
    badge: 'Popular'
  },
  {
    id: 'scene-2',
    title: 'Parisian Boulevard',
    prompt: 'a sunlit cobblestone street in Paris with Haussmannian architecture, outdoor cafe chairs, and warm golden afternoon light',
    badge: 'Editorial'
  },
  {
    id: 'scene-3',
    title: 'Tokyo Neon Runway',
    prompt: 'a futuristic neon-lit Tokyo street at night with glowing soft reflection on rain-brushed pavement',
    badge: 'Vibrant'
  },
  {
    id: 'scene-4',
    title: 'Luxury Rooftop Lounge',
    prompt: 'a high-end rooftop lounge overlooking a metropolitan city skyline during sunset with warm ambient lighting',
    badge: 'Luxury'
  },
  {
    id: 'scene-5',
    title: 'French Riviera Yacht',
    prompt: 'on the deck of a sleek yacht in Cannes with turquoise Mediterranean sea and sunny sky in the background',
  }
];

// Helper to convert remote image URL to base64 for Gemini
export async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
