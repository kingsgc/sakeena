
import React, { useState, useEffect, useCallback } from 'react';
import { Home, Heart, Settings, CircleDashed, Sparkles, ChevronRight, Moon, Sun, WifiOff, Share2, Trash2, Bell, BellOff, Palette, Gift } from 'lucide-react';
import { MOODS } from './constants';
import { AppTab, IslamicQuote, Mood, Theme } from './types';
import { generateQuote } from './services/geminiService';
import QuoteCard from './components/QuoteCard';
import Tasbih from './components/Tasbih';
import AdBanner from './components/AdBanner';
import InterstitialAd from './components/InterstitialAd';

// LIVE AD UNIT IDS (Updated with your provided IDs)
const AD_UNITS = {
  APP_ID: 'ca-app-pub-6687316362787087~9800010532',
  BANNER: 'ca-app-pub-6687316362787087/7312383307',
  INTERSTITIAL: 'ca-app-pub-6687316362787087/7381173247',
  REWARDED: 'ca-app-pub-6687316362787087/3181566602',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedMood, setSelectedMood] = useState<Mood>('Seeking Knowledge');
  const [quote, setQuote] = useState<IslamicQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<IslamicQuote[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [isRewardedMode, setIsRewardedMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');

  useEffect(() => {
    const savedFavs = localStorage.getItem('sakeena_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedTheme = localStorage.getItem('sakeena_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    }

    const savedNotifs = localStorage.getItem('sakeena_notifications');
    if (savedNotifs === 'true') setNotificationsEnabled(true);
    
    const savedTime = localStorage.getItem('sakeena_reminder_time');
    if (savedTime) setReminderTime(savedTime);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = (newTheme?: Theme) => {
    const targetTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(targetTheme);
    localStorage.setItem('sakeena_theme', targetTheme);
    if (targetTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (Math.random() < 0.4) triggerInterstitial();
  };

  const triggerInterstitial = () => {
    setIsRewardedMode(false);
    setShowInterstitial(true);
  };

  const triggerRewardedAd = () => {
    setIsRewardedMode(true);
    setShowInterstitial(true);
  };

  const fetchNewQuote = useCallback(async (mood: Mood, skipAd = false) => {
    if (!skipAd && Math.random() < 0.35) triggerInterstitial();
    
    setLoading(true);
    try {
      const newQuote = await generateQuote(mood);
      setQuote(newQuote);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewQuote(selectedMood, true);
  }, [selectedMood, fetchNewQuote]);

  const toggleFavorite = (q: IslamicQuote) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.quote === q.quote);
      const updated = exists 
        ? prev.filter(item => item.quote !== q.quote)
        : [q, ...prev];
      localStorage.setItem('sakeena_favorites', JSON.stringify(updated));
      if (!exists && Math.random() < 0.25) triggerInterstitial();
      return updated;
    });
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('sakeena_notifications', 'true');
        new Notification("Sakeena Reminders", { body: "Spiritual motivation is now active." });
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('sakeena_notifications', 'false');
    }
  };

  const clearCache = () => {
    if (confirm("Reset application data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderHome = () => (
    <div className="flex flex-col gap-6 pb-32">
      <header className="px-6 pt-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100 transition-colors">Assalamu Alaikum,</h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg flex items-center gap-2">
            How are you feeling?
            {!isOnline && <WifiOff size={16} className="text-amber-500" />}
          </p>
        </div>
        <button onClick={() => toggleTheme()} className="p-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm text-stone-600 dark:text-stone-300">
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>
      </header>

      <div className="px-6">
        <AdBanner adUnitId={AD_UNITS.BANNER} />
      </div>

      <div className="flex overflow-x-auto px-6 gap-3 no-scrollbar pb-2">
        {MOODS.map((m) => (
          <button
            key={m.label}
            onClick={() => setSelectedMood(m.label)}
            className={`flex-shrink-0 px-6 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 border ${
              selectedMood === m.label 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <span className="text-lg">{m.emoji}</span>
            <span className="font-semibold text-sm whitespace-nowrap">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="px-6 space-y-6">
        {quote && (
          <QuoteCard 
            quote={quote} 
            isLoading={loading} 
            onFavorite={toggleFavorite}
            isFavorited={!!favorites.find(f => f.quote === quote.quote)}
          />
        )}
        
        <button 
          onClick={() => fetchNewQuote(selectedMood)}
          disabled={loading}
          className="w-full bg-stone-800 dark:bg-emerald-600 text-white py-5 rounded-[2.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Sparkles size={20} />
          {loading ? 'Consulting Wisdom...' : 'Refresh Wisdom'}
        </button>
      </div>

      <AdBanner variant="large" adUnitId={AD_UNITS.BANNER} />
    </div>
  );

  return (
    <div className={`relative min-h-screen transition-colors duration-500 bg-[#fdfcf8] dark:bg-[#0a0a0a] max-w-md mx-auto overflow-hidden`}>
      <div className="absolute inset-0 arabesque-pattern pointer-events-none opacity-5 dark:opacity-10" />
      
      {showInterstitial && (
        <InterstitialAd 
          onClose={() => setShowInterstitial(false)} 
          adUnitId={isRewardedMode ? AD_UNITS.REWARDED : AD_UNITS.INTERSTITIAL} 
          isRewarded={isRewardedMode}
        />
      )}

      <main className="relative z-10 overflow-y-auto h-screen no-scrollbar">
        {activeTab === AppTab.HOME && renderHome()}
        {activeTab === AppTab.TASBIH && <div className="h-full"><Tasbih onTriggerInterstitial={triggerInterstitial} /></div>}
        {activeTab === AppTab.FAVORITES && (
          <div className="px-6 pt-10 pb-32 space-y-8">
            <h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100">Saved Wisdom</h2>
            {favorites.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-stone-400">
                <Heart size={48} className="mb-4" />
                <p>No wisdom saved yet.</p>
                <div className="mt-10 w-full"><AdBanner adUnitId={AD_UNITS.BANNER} /></div>
              </div>
            ) : (
              <div className="space-y-6">
                <AdBanner adUnitId={AD_UNITS.BANNER} />
                {favorites.map((fav, i) => (
                  <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-3xl border dark:border-stone-800">
                    <p className="font-serif text-lg italic mb-2 dark:text-stone-200">"{fav.quote}"</p>
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                      <span>{fav.reference}</span>
                      <button onClick={() => toggleFavorite(fav)} className="text-rose-400"><Heart size={16} fill="currentColor" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === AppTab.SETTINGS && (
          <div className="p-8 space-y-8 pb-32">
            <h2 className="text-3xl font-serif font-semibold text-stone-800 dark:text-stone-100">Settings</h2>
            
            <div className="space-y-4">
               {/* Reward Ad Section */}
               <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <Gift size={20} className="text-amber-600" />
                    <span className="font-bold text-stone-800 dark:text-stone-100 text-sm">Support the Mission</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Support our work by watching a short video. It helps us reach more people.</p>
                  <button 
                    onClick={triggerRewardedAd}
                    className="w-full bg-amber-600 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    Watch Reward Ad
                  </button>
               </div>

               <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border dark:border-stone-800 flex justify-between items-center" onClick={() => toggleTheme()}>
                  <div className="flex items-center gap-4">
                    <Palette size={20} className="text-indigo-500" />
                    <span className="font-bold dark:text-white">Theme Mode</span>
                  </div>
                  <span className="text-xs font-bold uppercase text-stone-400">{theme}</span>
               </div>
               
               <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border dark:border-stone-800 flex justify-between items-center" onClick={handleToggleNotifications}>
                  <div className="flex items-center gap-4">
                    <Bell size={20} className="text-emerald-500" />
                    <span className="font-bold dark:text-white">Push Notifications</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-stone-200'}`} />
               </div>

               <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border dark:border-stone-800 flex justify-between items-center text-rose-500" onClick={clearCache}>
                  <div className="flex items-center gap-4">
                    <Trash2 size={20} />
                    <span className="font-bold">Reset Application</span>
                  </div>
               </div>
            </div>
            <AdBanner variant="large" adUnitId={AD_UNITS.BANNER} />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t dark:border-stone-800 z-50">
        <div className="max-w-md mx-auto flex justify-around py-3">
          {[
            { id: AppTab.HOME, icon: Home, label: 'Sakeena' },
            { id: AppTab.TASBIH, icon: CircleDashed, label: 'Tasbih' },
            { id: AppTab.FAVORITES, icon: Heart, label: 'Saved' },
            { id: AppTab.SETTINGS, icon: Settings, label: 'More' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 p-2 ${activeTab === tab.id ? 'text-emerald-600' : 'text-stone-400'}`}>
              <tab.icon size={24} />
              <span className="text-[9px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;