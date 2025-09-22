import React, { useState, useCallback, useRef } from 'react';
import type { ImageState } from '../types';
import { UploadIcon, PersonIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (imageState: ImageState) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreview(previewUrl);
        onImageUpload({
          file: file,
          previewUrl: previewUrl,
          base64: base64String,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold">1</span>
        Upload Your Photo
      </h2>
      <div 
        className="w-full h-64 border-2 border-gray-700 rounded-lg flex items-center justify-center bg-gray-900/50 cursor-pointer hover:border-purple-600 hover:bg-gray-800/60 transition-colors relative group"
        onClick={handleButtonClick}
        role="button"
        aria-label="Upload your photo"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          id="photo-upload"
        />
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md p-1" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500 group-hover:text-purple-500 transition-colors" />
            <p className="mt-2 font-semibold">Click to upload an image</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP. A clear, full-body photo works best.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;