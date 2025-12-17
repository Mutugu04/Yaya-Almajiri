import { SurahMeta, Verse, PrayerTimesData, QiblaData } from "../types";

// --- Quran API ---

export const getAllSurahs = async (): Promise<SurahMeta[]> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    return [];
  }
};

export const getSurahVerses = async (surahNumber: number): Promise<Verse[]> => {
  try {
    // Fetch Arabic and English translation
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
    const data = await response.json();
    
    const arabicEd = data.data[0];
    const englishEd = data.data[1];
    
    const verses: Verse[] = arabicEd.ayahs.map((ayah: any, index: number) => ({
      surahNumber: surahNumber,
      ayahNumber: ayah.numberInSurah,
      surahNameAr: arabicEd.name,
      surahNameEn: arabicEd.englishName,
      arabicText: ayah.text,
      translation: englishEd.ayahs[index].text,
      transliteration: "", // API doesn't provide easily, can be skipped for full reader or fetched elsewhere
    }));

    return verses;
  } catch (error) {
    console.error("Failed to fetch verses:", error);
    return [];
  }
};

export const getAudioUrl = (surahNumber: number): string => {
  // Switched to Mishary Rashid Alafasy for high reliability
  const padded = surahNumber.toString().padStart(3, '0');
  return `https://server8.mp3quran.net/afs/${padded}.mp3`;
};

// --- Prayer Times API ---

export const getPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimesData | null> => {
  try {
    const date = Math.floor(Date.now() / 1000);
    const response = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=2`); // Method 2 is ISNA, a safe default
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    return null;
  }
};

export const getQiblaDirection = async (lat: number, lng: number): Promise<QiblaData | null> => {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch Qibla:", error);
    return null;
  }
};