import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OutfitDesigner from './components/OutfitDesigner';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import LookbookHistory from './components/LookbookHistory';
import ImageLightbox from './components/ImageLightbox';
import Footer from './components/Footer';
import { editImageWithOutfit } from './services/geminiService';
import type { ImageState, GeneratedImage, HistoryItem, ThemeMode, OutfitInputMode } from './types';
import { AlertCircle, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('aurafit_theme') as ThemeMode) || 'dark';
  });

  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [outfitDescription, setOutfitDescription] = useState<string>('');
  const [outfitImage, setOutfitImage] = useState<ImageState | null>(null);
  const [outfitInputMode, setOutfitInputMode] = useState<OutfitInputMode>('text');
  const [backgroundDescription, setBackgroundDescription] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lookbook history & Lightbox
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('aurafit_theme', theme);
  }, [theme]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('aurafit_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save lookbook history:', e);
    }
  }, [history]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleImageUpload = (imageState: ImageState) => {
    setOriginalImage(imageState);
    setGeneratedImage(null);
    setError(null);
  };

  const handleClearImage = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  const isGenerationDisabled =
    !originalImage ||
    isLoading ||
    (outfitInputMode === 'text' && !outfitDescription.trim()) ||
    (outfitInputMode === 'image' && !outfitImage);

  const activeStep = generatedImage ? 3 : originalImage ? 2 : 1;

  const handleGenerate = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image of yourself or choose a studio model sample.');
      return;
    }
    if (
      (outfitInputMode === 'text' && !outfitDescription.trim()) ||
      (outfitInputMode === 'image' && !outfitImage)
    ) {
      setError('Please describe an outfit or upload a garment reference image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const outfit =
        outfitInputMode === 'image' && outfitImage
          ? { image: { base64: outfitImage.base64, mimeType: outfitImage.mimeType } }
          : { description: outfitDescription };

      const result = await editImageWithOutfit(
        originalImage.base64,
        originalImage.mimeType,
        outfit,
        backgroundDescription
      );

      setGeneratedImage(result);

      // Auto-save to session lookbook
      const newItem: HistoryItem = {
        id: `look-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalImageUrl: originalImage.previewUrl,
        generatedImageUrl: result.imageUrl,
        outfitDescription: outfitDescription || 'Garment Reference',
        backgroundDescription: backgroundDescription || undefined,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // Keep last 20
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, outfitDescription, outfitImage, outfitInputMode, backgroundDescription]);

  const handleSaveCurrentToLookbook = () => {
    if (!generatedImage || !originalImage) return;
    const existing = history.find((h) => h.generatedImageUrl === generatedImage.imageUrl);
    if (!existing) {
      const newItem: HistoryItem = {
        id: `look-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalImageUrl: originalImage.previewUrl,
        generatedImageUrl: generatedImage.imageUrl,
        outfitDescription: outfitDescription || 'Garment Reference',
        backgroundDescription: backgroundDescription || undefined,
      };
      setHistory((prev) => [newItem, ...prev]);
    }
  };

  const isCurrentSaved = Boolean(
    generatedImage && history.some((h) => h.generatedImageUrl === generatedImage.imageUrl)
  );

  const handleSelectLookbookItem = (item: HistoryItem) => {
    setGeneratedImage({ imageUrl: item.generatedImageUrl, text: null });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5F5F7] dark:bg-[#000000] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Apple Ambient Gloss Background Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        savedCount={history.length}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        activeStep={activeStep}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Hero Headline Banner (Apple Event Studio Style Glass Card) */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 p-7 sm:p-9 rounded-3xl apple-glass-card apple-3d-card-hover relative overflow-hidden group">
          
          {/* Glossy Top Edge Highlight & Iridescent Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/15 border border-indigo-500/20 dark:border-indigo-400/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-3.5 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
              <span>Apple Vision Pro Level Photorealistic Rendering</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent leading-tight">
              Visualize Any Garment & Scene on You Instantly
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-medium">
              Upload your photo, describe your desired outfit or supply a garment image reference, and let Gemini re-render you in high-definition fashion.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-xs text-slate-700 dark:text-indigo-200">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md font-semibold shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Face & Body Retention</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Realistic Fabric Dynamics</span>
            </div>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Step 1 (Upload Photo) & Step 2 (Outfit Designer) */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <ImageUploader
              onImageUpload={handleImageUpload}
              currentImage={originalImage}
              onClearImage={handleClearImage}
            />

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

          {/* Column 2: Results Panel & Error Feedback */}
          <div className="lg:col-span-6 sticky top-24">
            <ResultDisplay
              originalImage={originalImage?.previewUrl ?? null}
              generatedImage={generatedImage}
              isLoading={isLoading}
              onOpenLightbox={(url) => setLightboxUrl(url)}
              onSaveToLookbook={handleSaveCurrentToLookbook}
              isSaved={isCurrentSaved}
            />

            {error && (
              <div className="mt-4 p-4.5 rounded-2xl apple-glass-card border-red-500/40 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <span className="font-bold">Generation Error:</span>
                  <p className="mt-0.5 text-xs text-red-600 dark:text-red-300/90 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Session Lookbook Drawer */}
      <LookbookHistory
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        items={history}
        onSelectLook={handleSelectLookbookItem}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Fullscreen Lightbox Modal */}
      <ImageLightbox
        imageUrl={lightboxUrl}
        onClose={() => setLightboxUrl(null)}
      />
    </div>
  );
};

export default App;
