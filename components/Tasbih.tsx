
import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import { TASBIH_PHRASES } from '../constants';
import AdBanner from './AdBanner';
import { playArabicTTS } from '../services/audioService';

interface TasbihProps {
  onTriggerInterstitial?: () => void;
}

const Tasbih: React.FC<TasbihProps> = ({ onTriggerInterstitial }) => {
  const [count, setCount] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [goal, setGoal] = useState(33);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleIncrement = () => {
    setCount(prev => (prev + 1) % (goal + 1));
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleReset = () => {
    setCount(0);
  };

  const cyclePhrase = (dir: number) => {
    setPhraseIdx(prev => (prev + dir + TASBIH_PHRASES.length) % TASBIH_PHRASES.length);
    setCount(0);
    if (Math.random() < 0.2) onTriggerInterstitial?.();
  };

  const toggleGoal = () => {
    setGoal(goal === 33 ? 99 : 33);
    if (Math.random() < 0.3) onTriggerInterstitial?.();
  };

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await playArabicTTS(TASBIH_PHRASES[phraseIdx].ar);
    } catch (e) {
      alert("Audio failed to load.");
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full max-w-sm mx-auto p-6 pt-12 pb-32">
      <div className="text-center space-y-4 w-full">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white transition-colors">Dhikr</h2>
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-3 transition-colors relative">
          <button 
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${isPlaying ? 'text-emerald-600 scale-110' : 'text-stone-300 dark:text-stone-700 hover:text-emerald-500'}`}
          >
            {isPlaying ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
          </button>
          
          <p className="font-arabic text-4xl text-emerald-700 dark:text-emerald-400 leading-relaxed">{TASBIH_PHRASES[phraseIdx].ar}</p>
          <div className="flex items-center justify-between gap-4 px-2">
            <button onClick={() => cyclePhrase(-1)} className="p-2 text-stone-300 dark:text-stone-600 hover:text-emerald-600 transition-colors"><ChevronLeft size={24}/></button>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-xs tracking-tight">{TASBIH_PHRASES[phraseIdx].en}</p>
            <button onClick={() => cyclePhrase(1)} className="p-2 text-stone-300 dark:text-stone-600 hover:text-emerald-600 transition-colors"><ChevronRight size={24}/></button>
          </div>
        </div>
      </div>

      <div 
        onClick={handleIncrement}
        className="relative w-72 h-72 rounded-full bg-emerald-600 shadow-2xl shadow-emerald-200/50 dark:shadow-emerald-900/40 flex flex-col items-center justify-center cursor-pointer active:scale-[0.96] transition-all border-[16px] border-emerald-500/20 group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-700/20 to-transparent rounded-full" />
        <span className="text-8xl font-serif text-white font-bold drop-shadow-md select-none group-active:scale-110 transition-transform">{count}</span>
        <span className="text-emerald-100/60 text-xs mt-2 font-bold tracking-[0.2em] uppercase select-none">Target {goal}</span>
        
        <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
      </div>

      <div className="w-full space-y-6">
        <div className="flex gap-4 w-full">
          <button 
            onClick={toggleGoal}
            className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 py-4 rounded-2xl text-stone-600 dark:text-stone-400 font-semibold text-sm active:bg-stone-50 dark:active:bg-stone-800 transition-colors shadow-sm"
          >
            Goal: {goal}
          </button>
          <button 
            onClick={handleReset}
            className="bg-stone-800 dark:bg-emerald-600 text-white p-4 rounded-2xl active:rotate-180 transition-transform duration-500 shadow-lg shadow-stone-200/50 dark:shadow-none"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        <AdBanner />
      </div>
    </div>
  );
};

export default Tasbih;
