import React from 'react';
import { WardrobeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-950/70 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <WardrobeIcon className="h-8 w-8 text-purple-400 mr-3" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          AI Virtual Fitting Room
        </h1>
      </div>
    </header>
  );
};

export default Header;