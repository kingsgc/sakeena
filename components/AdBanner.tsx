
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  variant?: 'standard' | 'large';
  adUnitId?: string; 
}

/**
 * AdBanner Component
 * Uses your live AdMob Slot ID: 7312383307
 * Client ID extracted from your App ID: ca-pub-6687316362787087
 */
const AdBanner: React.FC<AdBannerProps> = ({ variant = 'standard', adUnitId = 'ca-app-pub-6687316362787087/7312383307' }) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only attempt to push if the script is loaded and the element exists
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      console.warn("AdMob initialization pending or failed:", e);
    }
  }, []);

  const isLarge = variant === 'large';
  // Extract the 10-digit slot ID from the provided string
  const slotId = adUnitId.includes('/') ? adUnitId.split('/')[1] : adUnitId;

  return (
    <div className={`w-full flex flex-col items-center my-4 ${isLarge ? 'px-4' : ''}`}>
      <div className={`ad-slot-container w-full bg-transparent overflow-hidden transition-all duration-300 ${isLarge ? 'min-h-[250px]' : 'min-h-[50px] max-w-[320px]'}`}>
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: isLarge ? '100%' : '320px', 
            height: isLarge ? 'auto' : '50px',
            textAlign: 'center'
          }}
          data-ad-client="ca-pub-6687316362787087"
          data-ad-slot={slotId}
          data-ad-format={isLarge ? 'auto' : 'banner'}
          data-full-width-responsive={isLarge ? 'true' : 'false'}
          ref={adRef}
        />
      </div>
    </div>
  );
};

export default AdBanner;