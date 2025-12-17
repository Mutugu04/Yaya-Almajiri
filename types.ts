export interface Verse {
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  arabicText: string;
  translation: string;
  transliteration: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isAudio?: boolean;
}

export enum AppMode {
  HOME = 'HOME',
  RECOGNITION = 'RECOGNITION',
  READER = 'READER',
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  PRAYER = 'PRAYER',
  AZKAR = 'AZKAR',
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface PrayerTimesData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
  };
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string; ar: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
  };
}

export interface QiblaData {
  direction: number;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}