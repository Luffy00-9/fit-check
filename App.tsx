import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OutfitDesigner from './components/OutfitDesigner';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import Footer from './components/Footer';
import { editImageWithOutfit } from './services/geminiService';
import type { ImageState, GeneratedImage } from './types';

type OutfitInputMode = 'text' | 'image';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [outfitDescription, setOutfitDescription] = useState<string>('');
  const [outfitImage, setOutfitImage] = useState<ImageState | null>(null);
  const [outfitInputMode, setOutfitInputMode] = useState<OutfitInputMode>('text');
  const [backgroundDescription, setBackgroundDescription] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageState: ImageState) => {
    setOriginalImage(imageState);
    setGeneratedImage(null);
    setError(null);
  };

  const isGenerationDisabled = 
    !originalImage || 
    isLoading || 
    (outfitInputMode === 'text' && !outfitDescription.trim()) || 
    (outfitInputMode === 'image' && !outfitImage);


  const handleGenerate = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image of yourself.');
      return;
    }
    if ((outfitInputMode === 'text' && !outfitDescription.trim()) || (outfitInputMode === 'image' && !outfitImage)) {
      setError('Please describe an outfit or upload an image of one.');
      return;
    }


    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const outfit = outfitInputMode === 'image' && outfitImage
        ? { image: { base64: outfitImage.base64, mimeType: outfitImage.mimeType } }
        : { description: outfitDescription };

      const result = await editImageWithOutfit(
        originalImage.base64,
        originalImage.mimeType,
        outfit,
        backgroundDescription
      );
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, outfitDescription, outfitImage, outfitInputMode, backgroundDescription]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col font-sans">
      {isLoading && <LoadingOverlay />}
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Column */}
          <div className="flex flex-col gap-8 p-6 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-2xl shadow-purple-900/10">
            <ImageUploader onImageUpload={handleImageUpload} />
            <OutfitDesigner
              outfitDescription={outfitDescription}
              setOutfitDescription={setOutfitDescription}
              outfitImage={outfitImage}
              setOutfitImage={setOutfitImage}
              outfitInputMode={outfitInputMode}
              setOutfitInputMode={setOutfitInputMode}
              backgroundDescription={backgroundDescription}
              setBackgroundDescription={setBackgroundDescription}
              onGenerate={handleGenerate}
              isDisabled={isGenerationDisabled}
            />
          </div>

          {/* Output Column */}
          <div className="flex flex-col p-6 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-2xl shadow-purple-900/10">
            <ResultDisplay
              originalImage={originalImage?.previewUrl ?? null}
              generatedImage={generatedImage}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;