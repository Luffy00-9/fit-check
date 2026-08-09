export interface ImageState {
  file?: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  isSample?: boolean;
}

export interface GeneratedImage {
  imageUrl: string;
  text: string | null;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  outfitDescription: string;
  backgroundDescription?: string;
}

export type ViewMode = 'side-by-side' | 'slider' | 'single';

export type OutfitInputMode = 'text' | 'image';

export type ThemeMode = 'dark' | 'light';

export interface OutfitSuggestion {
  id: string;
  title: string;
  category: 'Professional' | 'Casual' | 'Evening' | 'Avant-Garde';
  prompt: string;
  iconName?: string;
}

export interface SceneSuggestion {
  id: string;
  title: string;
  prompt: string;
  badge?: string;
}
