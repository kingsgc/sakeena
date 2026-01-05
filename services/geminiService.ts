
import { GoogleGenAI, Type } from "@google/genai";
import { IslamicQuote, Mood } from "../types";
import { OFFLINE_QUOTES } from "../constants";

const CACHE_KEY = 'nur_quotes_cache';

const getCachedQuotes = (): IslamicQuote[] => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
};

const saveToCache = (quote: IslamicQuote) => {
  const cache = getCachedQuotes();
  if (!cache.find(q => q.quote === quote.quote)) {
    const updated = [quote, ...cache].slice(0, 50); // Keep last 50
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  }
};

export const generateQuote = async (mood: Mood): Promise<IslamicQuote> => {
  // If offline, return a random cached quote for this mood or a static fallback
  if (!navigator.onLine) {
    const cache = getCachedQuotes();
    const moodQuotes = cache.filter(q => q.mood === mood);
    if (moodQuotes.length > 0) {
      return moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
    }
    const staticQuotes = OFFLINE_QUOTES.filter(q => q.mood === mood);
    return staticQuotes.length > 0 ? staticQuotes[0] : OFFLINE_QUOTES[0];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give me a short, powerful Islamic motivational quote from the Quran, Hadith, or a famous scholar that specifically helps someone feeling "${mood}". 
                 Include the original Arabic text. The reflection should be 1-2 sentences of modern, compassionate advice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            arabicText: { type: Type.STRING },
            reference: { type: Type.STRING },
            reflection: { type: Type.STRING },
            mood: { type: Type.STRING },
          },
          required: ["quote", "arabicText", "reference", "reflection", "mood"]
        }
      }
    });

    const quoteData: IslamicQuote = JSON.parse(response.text);
    saveToCache(quoteData);
    return quoteData;
  } catch (e) {
    console.error("Gemini error, falling back to cache:", e);
    const cache = getCachedQuotes();
    const moodQuotes = cache.filter(q => q.mood === mood);
    return moodQuotes.length > 0 ? moodQuotes[0] : OFFLINE_QUOTES[0];
  }
};
