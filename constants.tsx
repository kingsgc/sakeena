
import React from 'react';
import { Mood, TasbihPhrase, IslamicQuote } from './types';

export const MOODS: { label: Mood; emoji: string; color: string; darkColor: string }[] = [
  { label: 'Anxious', emoji: '🌿', color: 'bg-emerald-50', darkColor: 'dark:bg-emerald-900/20' },
  { label: 'Grateful', emoji: '✨', color: 'bg-amber-50', darkColor: 'dark:bg-amber-900/20' },
  { label: 'Patient', emoji: '⏳', color: 'bg-stone-100', darkColor: 'dark:bg-stone-800' },
  { label: 'Lost', emoji: '🧭', color: 'bg-indigo-50', darkColor: 'dark:bg-indigo-900/20' },
  { label: 'Happy', emoji: '☀️', color: 'bg-yellow-50', darkColor: 'dark:bg-yellow-900/20' },
  { label: 'Tired', emoji: '🌙', color: 'bg-blue-50', darkColor: 'dark:bg-blue-900/20' },
  { label: 'Seeking Knowledge', emoji: '📖', color: 'bg-teal-50', darkColor: 'dark:bg-teal-900/20' },
];

export const OFFLINE_QUOTES: IslamicQuote[] = [
  {
    quote: "Verily, with every hardship comes ease.",
    arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    reference: "Quran 94:6",
    reflection: "No matter how dark the night, the dawn is promised by Allah.",
    mood: "Anxious"
  },
  {
    quote: "And He found you lost and guided you.",
    arabicText: "وَوَجَدَكَ ضَآلًّا فَهَدَىٰ",
    reference: "Quran 93:7",
    reflection: "Allah knows your path even when you feel you've lost your way.",
    mood: "Lost"
  },
  {
    quote: "So remember Me; I will remember you.",
    arabicText: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ",
    reference: "Quran 2:152",
    reflection: "Connection with the Divine is the ultimate remedy for the soul.",
    mood: "Seeking Knowledge"
  },
  {
    quote: "My mercy encompasses all things.",
    arabicText: "وَرَحْمَتِى وَسِعَتْ كُلَّ شَيْءٍ",
    reference: "Quran 7:156",
    reflection: "You are never beyond the reach of Allah's infinite love and compassion.",
    mood: "Tired"
  }
];

export const TASBIH_PHRASES: TasbihPhrase[] = [
  { en: "SubhanAllah (Glory be to Allah)", ar: "سُبْحَانَ ٱللَّٰهِ" },
  { en: "Alhamdulillah (Praise be to Allah)", ar: "ٱلْحَمْدُ لِلَّٰهِ" },
  { en: "Allahu Akbar (Allah is the Greatest)", ar: "ٱللَّٰهُ أَكْبَرُ" },
  { en: "La ilaha illallah (There is no god but Allah)", ar: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ" },
  { en: "Astaghfirullah (I seek forgiveness)", ar: "أَسْتَغْفِرُ ٱللَّٰهَ" },
  { en: "SubhanAllahi wa bihamdihi", ar: "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ" },
  { en: "SubhanAllahil 'Azeem", ar: "سُبْحَانَ ٱللَّٰهِ ٱلْعَظِيمِ" },
  { en: "La hawla wa la quwwata illa billah", ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ" },
  { en: "Hasbunallahu wa ni'mal wakeel", ar: "حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ" }
];
