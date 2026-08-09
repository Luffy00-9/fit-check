import React, { useRef, useState, useCallback } from 'react';
import type { ImageState, OutfitInputMode } from '../types';
import {
  Sparkles,
  Shirt,
  Image as ImageIcon,
  Camera,
  Compass,
  Wand2,
  Check,
  ChevronRight,
  Layers,
  MapPin,
  X
} from 'lucide-react';
import { OUTFIT_PRESETS, SCENE_PRESETS } from '../data/sampleData';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleOutfitFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
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
          setOutfitDescription('');
        };
        reader.readAsDataURL(file);
      }
    },
    [setOutfitImage, setOutfitDescription]
  );

  const categories = ['All', 'Professional', 'Casual', 'Evening', 'Avant-Garde'];

  const filteredPresets = selectedCategory === 'All'
    ? OUTFIT_PRESETS
    : OUTFIT_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-7 rounded-3xl apple-glass-card apple-3d-card-hover transition-all duration-300 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
      
      {/* Step 2 Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 font-bold text-sm backdrop-blur-md border border-indigo-500/20 dark:border-indigo-400/30 shadow-xs">
          2
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Design Your Outfit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Describe the garments or upload a reference garment photo
          </p>
        </div>
      </div>

      {/* iOS Segmented Control Tab Switcher */}
      <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 grid grid-cols-2 gap-1 text-xs font-semibold backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOutfitInputMode('text')}
          className={`btn-responsive flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
            outfitInputMode === 'text'
              ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-extrabold border border-black/5 dark:border-white/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Describe Outfit</span>
        </button>

        <button
          type="button"
          onClick={() => setOutfitInputMode('image')}
          className={`btn-responsive flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
            outfitInputMode === 'image'
              ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-extrabold border border-black/5 dark:border-white/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Garment Reference</span>
        </button>
      </div>

      {/* Mode 1: Text Prompt + Tonal Preset Chips */}
      {outfitInputMode === 'text' ? (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={outfitDescription}
              onChange={(e) => {
                setOutfitDescription(e.target.value);
                if (outfitImage) setOutfitImage(null);
              }}
              placeholder="e.g., A charcoal Italian double-breasted suit with white shirt and dark silk tie..."
              rows={3}
              className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none transition-all font-medium backdrop-blur-md"
            />
            {outfitDescription && (
              <button
                type="button"
                onClick={() => setOutfitDescription('')}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Material Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Style Presets:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Click to apply</span>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn-responsive px-3 py-1 text-[11px] font-extrabold rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Preset Tonal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => {
                const isSelected = outfitDescription === preset.prompt;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setOutfitDescription(preset.prompt);
                      if (outfitImage) setOutfitImage(null);
                    }}
                    className={`btn-responsive p-3 text-left rounded-2xl border transition-all text-xs flex flex-col justify-between backdrop-blur-md ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-950 dark:text-indigo-200 shadow-xs font-bold'
                        : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-indigo-500/50 hover:bg-black/10 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-extrabold text-xs mb-1">
                      <span>{preset.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                      {preset.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Garment Image Reference */
        <div>
          <input
            type="file"
            ref={outfitFileInputRef}
            onChange={handleOutfitFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <div
            onClick={() => outfitFileInputRef.current?.click()}
            className="w-full h-36 border-2 border-dashed border-slate-300/80 dark:border-white/20 rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/5 cursor-pointer hover:border-indigo-500 transition-all group p-2 backdrop-blur-md"
          >
            {outfitImage ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={outfitImage.previewUrl}
                  alt="Outfit Reference Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                    Replace Garment Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">
                <Camera className="w-8 h-8 mx-auto text-indigo-500 group-hover:scale-110 transition-transform mb-1" />
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Upload an image of a garment or outfit
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  AI will transfer this outfit onto your photo
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Background Scene Selector */}
      <div className="pt-4 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
            Select Scene / Location (Optional)
          </h3>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={backgroundDescription}
            onChange={(e) => setBackgroundDescription(e.target.value)}
            placeholder="e.g., Parisian street at sunset, luxury penthouse, sunny beach..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-medium backdrop-blur-md"
          />
          {backgroundDescription && (
            <button
              type="button"
              onClick={() => setBackgroundDescription('')}
              className="absolute top-2.5 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scene preset chips */}
        <div className="flex flex-wrap gap-1.5">
          {SCENE_PRESETS.map((scene) => {
            const isSelected = backgroundDescription === scene.prompt;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setBackgroundDescription(scene.prompt)}
                className={`btn-responsive px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all backdrop-blur-md ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 shadow-xs'
                    : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-indigo-500/50'
                }`}
              >
                {scene.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (Apple 3D Depth CTA Button) */}
      <button
        onClick={onGenerate}
        disabled={isDisabled}
        className="glossy-button glossy-shine btn-3d-depth btn-shimmer-sweep btn-responsive w-full mt-2 relative group overflow-hidden flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-extrabold text-white text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow group-hover:scale-110 transition-transform" />
        <span className="tracking-wide">Generate Virtual Try-On</span>
        <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};

export default OutfitDesigner;
