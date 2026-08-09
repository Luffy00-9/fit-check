import React, { useState } from 'react';
import { X, Download, Share2, Check, ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `aurafit-inspection-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
    >
      {/* Top Action Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex items-center justify-between gap-4 text-white z-10"
      >
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
          <ZoomIn className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-extrabold">Studio High-Res Inspection</span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center my-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950"
      >
        <img
          src={imageUrl}
          alt="Inspected High Res Result"
          className="w-full h-full object-contain max-h-[75vh]"
        />
      </div>

      {/* Bottom Floating Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm p-3 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-2xl flex items-center justify-around gap-2 text-xs font-extrabold text-white shadow-2xl z-10"
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{isCopied ? 'Link Copied' : 'Share'}</span>
        </button>

        <div className="w-px h-6 bg-white/20" />

        <button
          onClick={handleDownload}
          className="glossy-button glossy-shine flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default ImageLightbox;
