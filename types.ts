
export type Mood = 'Anxious' | 'Grateful' | 'Patient' | 'Lost' | 'Happy' | 'Tired' | 'Seeking Knowledge';

export type Theme = 'light' | 'dark';

export interface IslamicQuote {
  quote: string;
  arabicText?: string;
  reference: string;
  reflection: string;
  mood: Mood;
}

export interface TasbihPhrase {
  en: string;
  ar: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  reminderTime: string;
  theme: Theme;
}

export enum AppTab {
  HOME = 'home',
  TASBIH = 'tasbih',
  FAVORITES = 'favorites',
  SETTINGS = 'settings'
}
