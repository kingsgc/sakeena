
import React, { useState } from 'react';
import { IslamicQuote } from '../types';
import { Bookmark, Share2, Quote as QuoteIcon, Volume2, Loader2 } from 'lucide-react';
import { playArabicTTS } from '../services/audioService';

interface QuoteCardProps {
  quote: IslamicQuote;
  isLoading?: boolean;
  onFavorite?: (quote: IslamicQuote) => void;
  isFavorited?: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading, onFavorite, isFavorited }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-80 bg-stone-100 dark:bg-stone-800 animate-pulse rounded-[2.5rem] flex items-center justify-center">
        <div className="text-stone-400 dark:text-stone-600 font-bold uppercase tracking-widest text-[10px]">Seeking wisdom...</div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sakeena - Islamic Motivation',
        text: `${quote.arabicText ? quote.arabicText + '\n' : ''}"${quote.quote}" — ${quote.reference}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`"${quote.quote}" — ${quote.reference}`).then(() => {
        alert("Quote copied to clipboard!");
      });
    }
  };

  const handlePlayAudio = async () => {
    if (!quote.arabicText || isPlaying) return;
    setIsPlaying(true);
    try {
      await playArabicTTS(quote.arabicText);
    } catch (e) {
      alert("Failed to load audio. Please check your connection.");
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full min-h-[450px] bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl shadow-stone-200/50 dark:shadow-black/20 p-8 flex flex-col justify-between overflow-hidden group border border-transparent dark:border-stone-800 transition-colors duration-300">
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity dark:text-white pointer-events-none">
         <QuoteIcon size={120} />
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold w-fit tracking-wider uppercase transition-colors">
            {quote.mood}
          </div>
          {quote.arabicText && (
            <button 
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className={`p-2.5 rounded-xl transition-all ${isPlaying ? 'bg-emerald-600 text-white' : 'bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-emerald-600'}`}
            >
              {isPlaying ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
            </button>
          )}
        </div>
        
        {quote.arabicText && (
          <p className="font-arabic text-3xl md:text-4xl leading-relaxed text-emerald-900 dark:text-emerald-200 text-center my-2 drop-shadow-sm">
            {quote.arabicText}
          </p>
        )}

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-800 dark:text-stone-100 italic border-l-4 border-stone-100 dark:border-stone-800 pl-4 py-2 transition-colors">
          "{quote.quote}"
        </p>
        
        <p className="text-stone-400 dark:text-stone-500 font-medium tracking-wide text-sm">
          — {quote.reference}
        </p>

        <div className="h-px bg-stone-50 dark:bg-stone-800 my-2" />

        <div className="bg-stone-50/50 dark:bg-stone-800/50 p-4 rounded-2xl transition-colors">
          <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] mb-2">Reflection</h4>
          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
            {quote.reflection}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 mt-8">
        <button 
          onClick={() => onFavorite?.(quote)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all ${
            isFavorited 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50' 
              : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 active:scale-95'
          }`}
        >
          <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          <span className="font-semibold text-sm">{isFavorited ? 'Saved' : 'Save'}</span>
        </button>
        <button 
          className="bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 p-3.5 rounded-2xl active:scale-95 transition-all"
          onClick={handleShare}
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuoteCard;
