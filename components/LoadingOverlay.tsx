import React, { useState, useEffect } from 'react';
import { Sparkles, Shirt, Wand2, Scissors, Camera, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: Camera, title: "Analyzing model posture & proportions..." },
  { icon: Scissors, title: "Tailoring digital garments & fabric weight..." },
  { icon: Wand2, title: "Simulating realistic cloth folds & highlights..." },
  { icon: Shirt, title: "Harmonizing studio lighting & scene shadows..." },
  { icon: Sparkles, title: "Finalizing 4K virtual try-on render..." }
];

const LoadingOverlay: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      
      {/* Apple Glass Liquid Modal Card */}
      <div className="w-full max-w-sm p-8 rounded-3xl apple-glass-card shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />
        
        {/* Animated Icon Ring */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-3xl border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30 glossy-shine">
            <CurrentIcon className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Message & Step Progress */}
        <div className="w-full space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {steps[currentStepIndex].title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Powered by Gemini AI Multimodal Vision
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? 'w-7 bg-indigo-600 dark:bg-indigo-400 shadow-xs'
                  : 'w-1.5 bg-black/10 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};

export default LoadingOverlay;
