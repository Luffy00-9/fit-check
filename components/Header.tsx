import React from 'react';
import { Sparkles, Moon, Sun, Sparkle, Shirt, Layers, Image as ImageIcon } from 'lucide-react';
import type { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  savedCount: number;
  onOpenLookbook: () => void;
  activeStep: number;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  savedCount,
  onOpenLookbook,
  activeStep,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full apple-glass border-b border-white/40 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand & iOS Status Capsule */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 active:scale-95 transition-transform glossy-shine">
            <div className="w-full h-full bg-white/90 dark:bg-black/90 rounded-[14px] flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                AuraFit <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/30 backdrop-blur-md shadow-xs">STUDIO</span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Apple-Style AI Virtual Fitting Room
            </p>
          </div>
        </div>

        {/* Step Indicator (Apple Segmented Glass Control) */}
        <div className="hidden md:flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-semibold backdrop-blur-lg">
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
            activeStep >= 1 ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-bold border border-black/5 dark:border-white/20' : 'text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Photo</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
            activeStep >= 2 ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-bold border border-black/5 dark:border-white/20' : 'text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Style & Scene</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
            activeStep >= 3 ? 'bg-white dark:bg-white/15 text-indigo-600 dark:text-white shadow-sm font-bold border border-black/5 dark:border-white/20' : 'text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Result</span>
          </div>
        </div>

        {/* Right Actions: Lookbook & Theme Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Saved Lookbook Button (Glossy Glass Capsule) */}
          <button
            onClick={onOpenLookbook}
            className="relative glossy-button btn-responsive btn-shimmer-sweep flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-500/30 dark:border-indigo-400/30 backdrop-blur-lg shadow-sm"
            title="Saved Lookbook"
          >
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Lookbook</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-600 text-white min-w-[20px] shadow-xs animate-bounce">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Apple Glass Pill Button) */}
          <button
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-2xl btn-responsive bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/15 backdrop-blur-lg shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
