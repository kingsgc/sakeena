
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Gift } from 'lucide-react';

interface InterstitialAdProps {
  onClose: () => void;
  adUnitId?: string;
  isRewarded?: boolean;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  onClose, 
  adUnitId = 'ca-app-pub-6687316362787087/7381173247',
  isRewarded = false
}) => {
  const [countdown, setCountdown] = useState(isRewarded ? 10 : 5);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Show the "Ad Loading" UI for a brief moment before the SDK takes over
    const loadTimer = setTimeout(() => setIsLoaded(true), 500);
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(loadTimer);
      };
    }
  }, [countdown]);

  useEffect(() => {
    if (isLoaded) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error("AdMob Interstitial push error:", e);
      }
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  const slotId = adUnitId.includes('/') ? adUnitId.split('/')[1] : adUnitId;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col items-center justify-center">
      {/* Real Ad Background Container */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <ins 
            className="adsbygoogle h-full w-full block"
            data-ad-client="ca-pub-6687316362787087"
            data-ad-slot={slotId}
         />
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white/50 text-xs font-bold uppercase tracking-widest z-10">
        <div className="flex items-center gap-2">
          {isRewarded ? <Gift size={14} className="text-amber-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
          {isRewarded ? 'Reward Session' : 'Sakeena Ad'}
        </div>
        {countdown === 0 ? (
          <button 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        ) : (
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-white">
            {isRewarded ? 'Reward in' : 'Skip in'} {countdown}s
          </div>
        )}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-8 space-y-8">
         <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${isRewarded ? 'bg-amber-600 shadow-amber-500/20' : 'bg-emerald-600 shadow-emerald-500/20'}`}>
            {isRewarded ? <Gift size={40} className="text-white" /> : <ShieldCheck size={40} className="text-white" />}
         </div>
         
         <div className="text-center space-y-3 max-w-xs">
            <h3 className="text-2xl font-bold text-white">{isRewarded ? 'Support the Mission' : 'Connecting to Wisdom'}</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              {isRewarded 
                ? "Watching this ad helps us maintain the servers for the Ummah. JazakAllah Khair." 
                : "Thank you for supporting Sakeena. Your journey to peace continues shortly."}
            </p>
         </div>

         <div className="w-48 h-1 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 linear ${isRewarded ? 'bg-amber-500' : 'bg-emerald-50'}`} 
              style={{ width: `${(( (isRewarded ? 10 : 5) - countdown) / (isRewarded ? 10 : 5)) * 100}%` }}
            />
         </div>
      </div>
    </div>
  );
};

export default InterstitialAd;