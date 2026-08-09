import React from 'react';
import type { HistoryItem } from '../types';
import { X, Trash2, Download, ExternalLink, Layers, Sparkles } from 'lucide-react';

interface LookbookHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectLook: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

const LookbookHistory: React.FC<LookbookHistoryProps> = ({
  isOpen,
  onClose,
  items,
  onSelectLook,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 dark:bg-black/80 backdrop-blur-xl transition-opacity">
      
      {/* Sliding Apple Glass Drawer Card */}
      <div className="w-full max-w-md h-full apple-glass-card border-l border-white/40 dark:border-white/10 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300 relative">
        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/30 backdrop-blur-md">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Session Lookbook
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {items.length} saved try-on {items.length === 1 ? 'look' : 'looks'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-responsive p-2 rounded-2xl bg-black/5 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-black/5 dark:border-white/10 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Items */}
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-10 h-10 text-indigo-400/60 animate-pulse" />
              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-2">
                Your lookbook is empty
              </p>
              <p className="text-xs text-slate-500 max-w-xs font-medium">
                Generate an outfit try-on and click "Save to Lookbook" to store your favorite outfits here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group btn-responsive relative p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-lg transition-all flex gap-3 backdrop-blur-md"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-black/10 dark:border-white/10 shadow-sm">
                    <img
                      src={item.generatedImageUrl}
                      alt="Lookbook Item"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {item.timestamp}
                      </span>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">
                        {item.outfitDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onSelectLook(item);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors ml-auto"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear Lookbook
            </button>
            <span className="text-[11px] text-slate-400 font-medium">
              Saved in session
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default LookbookHistory;
