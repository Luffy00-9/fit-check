
export interface ImageState {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface GeneratedImage {
  imageUrl: string;
  text: string | null;
}
