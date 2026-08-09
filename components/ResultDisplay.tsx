import React, { useState, useRef } from 'react';
import type { GeneratedImage, ViewMode } from '../types';
import {
  Download,
  Maximize2,
  Sliders,
  Columns,
  Square,
  Sparkles,
  Share2,
  Check,
  Bookmark,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
  onOpenLightbox: (url: string) => void;
  onSaveToLookbook?: () => void;
  isSaved?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImage,
  isLoading,
  onOpenLightbox,
  onSaveToLookbook,
  isSaved = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!generatedImage?.imageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `aurafit-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!generatedImage?.imageUrl) return;
    try {
      await navigator.clipboard.writeText(generatedImage.imageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-7 rounded-3xl apple-glass-card apple-3d-card-hover transition-all duration-300 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
      
      {/* Header & View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Studio Result
          </h2>
        </div>

        {/* View Mode Segmented Control */}
        <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-1 text-xs font-semibold backdrop-blur-md">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`btn-responsive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-extrabold border border-black/5 dark:border-white/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Side-by-Side View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('slider')}
            disabled={!originalImage || !generatedImage}
            className={`btn-responsive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all disabled:opacity-40 ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-extrabold border border-black/5 dark:border-white/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Interactive Comparison Slider"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Slider</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`btn-responsive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'single'
                ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-extrabold border border-black/5 dark:border-white/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Single High-Res View"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Focus</span>
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      {isLoading ? (
        /* Loading Spinner Canvas */
        <div className="w-full aspect-square rounded-2xl bg-slate-950/60 border border-indigo-500/30 flex flex-col items-center justify-center p-6 text-center gap-4 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent animate-shimmer" />
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100">Generating Virtual Try-On</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Applying lighting, cloth dynamics & face retention...</p>
          </div>
        </div>
      ) : viewMode === 'slider' && originalImage && generatedImage ? (
        /* Interactive Split Comparison Slider View */
        <div
          ref={sliderRef}
          onMouseMove={handleSliderMove}
          onTouchMove={handleSliderMove}
          className="relative w-full aspect-square rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-slate-950 cursor-ew-resize select-none group shadow-xl"
        >
          {/* Background: Generated Image */}
          <img
            src={generatedImage.imageUrl}
            alt="Virtual Try-On"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Foreground: Original Image with clip path */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalImage}
              alt="Original Photo"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : '100%' }}
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/20">
              ORIGINAL
            </div>
          </div>

          <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-extrabold border border-white/20">
            TRY-ON
          </div>

          {/* Divider handle line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-indigo-600 shadow-xl flex items-center justify-center border-2 border-indigo-500 glossy-shine">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      ) : viewMode === 'single' ? (
        /* Single Focus View */
        <div className="relative group rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-slate-950 aspect-square flex items-center justify-center shadow-xl">
          {generatedImage ? (
            <>
              <img
                src={generatedImage.imageUrl}
                alt="Generated Outfit"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => onOpenLightbox(generatedImage.imageUrl)}
                className="absolute top-3 right-3 p-2 rounded-2xl bg-slate-950/70 backdrop-blur-md text-white hover:bg-indigo-600 transition-colors shadow-lg border border-white/20"
                title="Expand Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          ) : originalImage ? (
            <div className="relative w-full h-full">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                Original Upload (Select Outfit to Generate)
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-sm font-extrabold text-slate-300">No Image Uploaded</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Upload a photo in Step 1 to see virtual try-on results</p>
            </div>
          )}
        </div>
      ) : (
        /* Side-by-Side View (Default) */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Original Card */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Original
            </span>
            <div className="relative group rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-slate-950 aspect-square flex items-center justify-center shadow-md">
              {originalImage ? (
                <>
                  <img
                    src={originalImage}
                    alt="Original Photo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onOpenLightbox(originalImage)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">Your Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Card */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-between">
              <span>Virtual Try-On</span>
              {generatedImage && <Sparkles className="w-3.5 h-3.5" />}
            </span>
            <div className="relative group rounded-2xl overflow-hidden border-2 border-indigo-500/60 dark:border-indigo-400/80 bg-slate-950 aspect-square flex items-center justify-center shadow-xl shadow-indigo-500/10">
              {generatedImage ? (
                <>
                  <img
                    src={generatedImage.imageUrl}
                    alt="AI Virtual Try-On Result"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onOpenLightbox(generatedImage.imageUrl)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                  <Sparkles className="w-8 h-8 mb-2 text-indigo-500/60" />
                  <span className="text-xs font-bold text-slate-400">AI Generated Result</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 font-medium">Click "Generate" to process</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Result Action Bar */}
      {generatedImage && (
        <div className="pt-3 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {onSaveToLookbook && (
              <button
                onClick={onSaveToLookbook}
                className={`glossy-button btn-responsive btn-shimmer-sweep flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all shadow-xs ${
                  isSaved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 dark:border-indigo-400/30 hover:bg-indigo-500/20'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saved in Lookbook' : 'Save to Lookbook'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="btn-responsive flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all backdrop-blur-md"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="glossy-button glossy-shine btn-3d-depth btn-shimmer-sweep btn-responsive flex items-center gap-2 px-4.5 py-2.5 text-xs font-extrabold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all ml-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>

        </div>
      )}

    </div>
  );
};

export default ResultDisplay;
