import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 apple-glass border-t border-white/40 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            AuraFit STUDIO
          </span>
          <span>• Powered by Gemini AI</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Private & Confidential</span>
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>High-Speed AI Processing</span>
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
