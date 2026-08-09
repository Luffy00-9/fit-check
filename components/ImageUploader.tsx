import React, { useState, useCallback, useRef } from 'react';
import type { ImageState } from '../types';
import { Upload, User, Image as ImageIcon, Sparkles, Check, RefreshCw, X, Camera } from 'lucide-react';
import { SAMPLE_MODELS, urlToBase64, SampleModel } from '../data/sampleData';

interface ImageUploaderProps {
  onImageUpload: (imageState: ImageState) => void;
  currentImage: ImageState | null;
  onClearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage, onClearImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      const previewUrl = URL.createObjectURL(file);
      onImageUpload({
        file: file,
        previewUrl: previewUrl,
        base64: base64String,
        mimeType: file.type,
        isSample: false,
      });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSample = async (sample: SampleModel) => {
    try {
      setIsLoadingSample(sample.id);
      const { base64, mimeType } = await urlToBase64(sample.previewUrl);
      onImageUpload({
        previewUrl: sample.previewUrl,
        base64,
        mimeType,
        isSample: true,
      });
    } catch (err) {
      console.error('Error loading sample photo:', err);
    } finally {
      setIsLoadingSample(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-7 rounded-3xl apple-glass-card apple-3d-card-hover transition-all duration-300 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 font-bold text-sm backdrop-blur-md border border-indigo-500/20 dark:border-indigo-400/30 shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Upload Your Photo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              A full-body or upper-body portrait works best
            </p>
          </div>
        </div>

        {currentImage && (
          <button
            onClick={onClearImage}
            className="btn-responsive flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-black/5 dark:bg-white/10 hover:bg-red-500/20 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10 backdrop-blur-md"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Main Upload Zone or Preview */}
      {currentImage ? (
        <div className="relative group rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-slate-950 aspect-[4/5] sm:aspect-square flex items-center justify-center shadow-xl">
          <img
            src={currentImage.previewUrl}
            alt="Uploaded Model Preview"
            className="w-full h-full object-contain bg-slate-950/60"
          />
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="glossy-button btn-responsive btn-shimmer-sweep flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl bg-white text-slate-900 shadow-xl hover:bg-slate-100"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Photo</span>
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/20 text-white text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {currentImage.isSample ? 'Studio Model Loaded' : 'Custom Photo Ready'}
            </span>
            <span className="text-[10px] opacity-75 font-mono">HD Vision Ready</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer w-full rounded-2xl p-6 sm:p-8 border-2 border-dashed transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 backdrop-blur-xl scale-[1.01]'
              : 'border-slate-300/80 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:border-indigo-500 dark:hover:border-indigo-400/80 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-md hover:-translate-y-1 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/30 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform glossy-shine">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Drop your photo here or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50">browse</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Supports PNG, JPG or WEBP (up to 10MB)
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            id="photo-upload-input"
          />
        </div>
      )}

      {/* Quick Studio Models Bar */}
      {!currentImage && (
        <div className="pt-2 border-t border-black/5 dark:border-white/10">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Or test with a studio model sample:</span>
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {SAMPLE_MODELS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                disabled={isLoadingSample !== null}
                className="group btn-responsive relative flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-lg text-left disabled:opacity-50 backdrop-blur-md"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-black/5 dark:border-white/10">
                  <img
                    src={sample.previewUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isLoadingSample === sample.id && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageUploader;
