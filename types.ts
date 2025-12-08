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
  ART = 'ART',
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}