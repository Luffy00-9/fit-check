import React, { useCallback, useRef, useState } from 'react';
import type { ImageState } from '../types';
import { SparklesIcon, TshirtIcon, LandscapeIcon, CameraIcon } from './icons';

type OutfitInputMode = 'text' | 'image';

interface OutfitDesignerProps {
  outfitDescription: string;
  setOutfitDescription: (description: string) => void;
  outfitImage: ImageState | null;
  setOutfitImage: (image: ImageState | null) => void;
  outfitInputMode: OutfitInputMode;
  setOutfitInputMode: (mode: OutfitInputMode) => void;
  backgroundDescription: string;
  setBackgroundDescription: (description: string) => void;
  onGenerate: () => void;
  isDisabled: boolean;
}

const outfitSuggestions = [
  "a red formal dress",
  "a stylish business suit",
  "a vintage denim jacket",
  "a cozy winter sweater",
  "a summer floral sundress",
  "a futuristic cyberpunk outfit",
];

const backgroundSuggestions = [
  "a sunny beach",
  "a bustling city street",
  "a minimalist studio",
  "a magical forest",
  "a neon-lit Tokyo night",
  "a cozy Parisian cafe",
];


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );

const OutfitDesigner: React.FC<OutfitDesignerProps> = ({
  outfitDescription,
  setOutfitDescription,
  outfitImage,
  setOutfitImage,
  outfitInputMode,
  setOutfitInputMode,
  backgroundDescription,
  setBackgroundDescription,
  onGenerate,
  isDisabled,
}) => {
    const outfitFileInputRef = useRef<HTMLInputElement>(null);

    const handleOutfitFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                const previewUrl = URL.createObjectURL(file);
                setOutfitImage({
                    file: file,
                    previewUrl: previewUrl,
                    base64: base64String,
                    mimeType: file.type,
                });
                setOutfitDescription(''); // Clear text when image is uploaded
            };
            reader.readAsDataURL(file);
        }
    }, [setOutfitImage, setOutfitDescription]);


  return (
    <div className="flex flex-col gap-6">
      {/* Outfit Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold">2</span>
          Design Your Outfit
        </h2>
        
        <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
            <TabButton active={outfitInputMode === 'text'} onClick={() => setOutfitInputMode('text')}>Describe</TabButton>
            <TabButton active={outfitInputMode === 'image'} onClick={() => setOutfitInputMode('image')}>Upload Image</TabButton>
        </div>

        {outfitInputMode === 'text' ? (
            <div>
                <textarea
                value={outfitDescription}
                onChange={(e) => {
                    setOutfitDescription(e.target.value)
                    if (outfitImage) setOutfitImage(null);
                }}
                placeholder="e.g., a black leather jacket, white t-shirt, and dark blue jeans..."
                className="w-full h-24 p-3 bg-gray-700/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-200 placeholder-gray-500 resize-none"
                aria-label="Outfit Description"
                />
                <div className="mt-2">
                <p className="text-sm text-gray-400 mb-2">Need ideas? Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                    {outfitSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => {
                            setOutfitDescription(suggestion);
                            if (outfitImage) setOutfitImage(null);
                        }}
                        className="px-3 py-1 text-xs bg-gray-700/50 border border-gray-600 rounded-full hover:border-purple-500 hover:bg-purple-900/30 text-gray-300 transition-colors"
                    >
                        {suggestion}
                    </button>
                    ))}
                </div>
                </div>
            </div>
        ) : (
            <div>
                <input 
                    type="file" 
                    ref={outfitFileInputRef} 
                    onChange={handleOutfitFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                <div 
                    className="w-full h-24 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-gray-900/50 cursor-pointer hover:border-purple-500"
                    onClick={() => outfitFileInputRef.current?.click()}
                >
                    {outfitImage ? (
                        <img src={outfitImage.previewUrl} alt="Outfit preview" className="w-full h-full object-contain p-1 rounded-md" />
                    ) : (
                        <div className="text-center text-gray-500">
                           <CameraIcon className="w-8 h-8 mx-auto" />
                           <p className="text-sm font-semibold mt-1">Upload outfit image</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Background Section */}
      <div className="flex flex-col gap-4">
         <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold">3</span>
            Set The Scene (Optional)
        </h2>
        <textarea
          value={backgroundDescription}
          onChange={(e) => setBackgroundDescription(e.target.value)}
          placeholder="e.g., standing on a beach at sunset, in a futuristic city..."
          className="w-full h-24 p-3 bg-gray-700/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-200 placeholder-gray-500 resize-none"
          aria-label="Background Description"
        />
        <div className="mt-[-8px]">
          <p className="text-sm text-gray-400 mb-2">Or try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {backgroundSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setBackgroundDescription(suggestion)}
                className="px-3 py-1 text-xs bg-gray-700/50 border border-gray-600 rounded-full hover:border-purple-500 hover:bg-purple-900/30 text-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50 transform hover:scale-105 mt-2"
      >
        <SparklesIcon className="w-5 h-5" />
        Generate My Look
      </button>
    </div>
  );
};

export default OutfitDesigner;