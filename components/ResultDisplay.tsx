import React from 'react';
import type { GeneratedImage } from '../types';
import { ImageIcon, DownloadIcon } from './icons';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
}

const ImagePlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="w-full aspect-square bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4 text-center">
    <ImageIcon className="w-12 h-12 mb-2" />
    <span className="text-sm font-medium">{title}</span>
  </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImage,
  isLoading,
}) => {
  const handleDownload = () => {
    if (!generatedImage?.imageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = 'virtual-try-on.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl text-center font-semibold text-gray-200 mb-4">Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-gray-400 mb-2 text-center sm:text-left">Original</h3>
          {originalImage ? (
            <img src={originalImage} alt="Original" className="w-full aspect-square object-cover rounded-lg border border-gray-700" />
          ) : (
            <ImagePlaceholder title="Your Photo" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-purple-400 text-center sm:text-left">Virtual Try-On</h3>
            {generatedImage && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                aria-label="Download generated image"
                title="Download Image"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
          {generatedImage ? (
             <div className="w-full">
              <img src={generatedImage.imageUrl} alt="Generated Outfit" className="w-full aspect-square object-cover rounded-lg border border-purple-500" />
              {generatedImage.text && <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-800 rounded">{generatedImage.text}</p>}
            </div>
          ) : isLoading ? (
            <div className="w-full aspect-square bg-gray-900/50 border-2 border-dashed border-purple-800/50 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ImagePlaceholder title="AI Generated Image" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;