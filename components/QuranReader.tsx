import React, { useState } from 'react';
import { getSurahContent } from '../services/geminiService';
import { Verse, SurahMeta } from '../types';

const COMMON_SURAHS: SurahMeta[] = [
  { number: 1, name: "Al-Fatiha", englishName: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 18, name: "Al-Kahf", englishName: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 36, name: "Ya-Sin", englishName: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "Ar-Rahman", englishName: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 67, name: "Al-Mulk", englishName: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "Al-Falaq", englishName: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "An-Nas", englishName: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" },
];

export const QuranReader: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectSurah = async (surah: SurahMeta) => {
    setSelectedSurah(surah);
    setLoading(true);
    setVerses([]);
    try {
      const content = await getSurahContent(surah.number);
      setVerses(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    setSelectedSurah(null);
  };

  return (
    <div className="flex h-[calc(100dvh-120px)] w-full max-w-6xl mx-auto gap-6 p-2 md:p-4">
      {/* Sidebar List - Hidden on mobile if surah selected */}
      <div className={`
        ${selectedSurah ? 'hidden md:flex' : 'flex'} 
        w-full md:w-1/4 bg-white/80 rounded-xl shadow-lg border border-moroccan-gold/20 overflow-hidden flex-col
      `}>
        <div className="bg-moroccan-teal p-4 text-white font-serif text-lg font-bold flex justify-between items-center">
          <span>Surahs</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">Select one</span>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2 scrollbar-hide">
          {COMMON_SURAHS.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSelectSurah(surah)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedSurah?.number === surah.number
                  ? 'bg-moroccan-sand text-moroccan-teal font-bold shadow-sm ring-1 ring-moroccan-gold/50'
                  : 'hover:bg-gray-100 text-moroccan-dark bg-white/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moroccan-teal/10 text-xs font-bold mr-2 shrink-0">
                  {surah.number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{surah.englishName}</p>
                  <p className="text-xs text-gray-500 font-arabic truncate">{surah.name}</p>
                </div>
              </div>
            </button>
          ))}
          <div className="text-center text-xs text-gray-400 mt-4 italic">
            (Demo List)
          </div>
        </div>
      </div>

      {/* Content Area - Hidden on mobile if no surah selected */}
      <div className={`
        ${!selectedSurah ? 'hidden md:flex' : 'flex'} 
        w-full md:flex-1 bg-white/90 rounded-xl shadow-lg border border-moroccan-gold/20 overflow-hidden flex-col relative
      `}>
        {!selectedSurah ? (
          <div className="flex flex-col items-center justify-center h-full text-moroccan-dark/50 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-20 md:w-20 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xl font-serif">Select a Surah from the list to begin reading</p>
          </div>
        ) : (
          <>
            <div className="bg-moroccan-sand/50 p-4 md:p-6 text-center border-b border-moroccan-gold/20 relative">
               {/* Mobile Back Button */}
               <button 
                 onClick={handleBackToMenu}
                 className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 text-moroccan-teal hover:text-moroccan-dark p-2"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
               </button>

               <h2 className="text-2xl md:text-3xl font-arabic text-moroccan-teal font-bold">{selectedSurah.name}</h2>
               <p className="text-moroccan-dark uppercase tracking-widest text-xs md:text-sm mt-1">{selectedSurah.englishName}</p>
               {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                 <p className="text-xl md:text-2xl font-arabic text-moroccan-dark/70 mt-3 font-normal">
                   بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                 </p>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scrollbar-hide">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                verses.map((v) => (
                  <div key={v.ayahNumber} className="border-b border-moroccan-gold/10 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-moroccan-gold/20 text-moroccan-dark px-2 py-1 rounded-md text-xs font-bold">
                            {selectedSurah.number}:{v.ayahNumber}
                        </span>
                    </div>
                    <p className="text-2xl md:text-4xl text-right font-arabic leading-loose mb-4 text-moroccan-dark" dir="rtl">
                      {v.arabicText} <span className="text-moroccan-gold text-lg md:text-2xl">۝</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-2 italic">{v.transliteration}</p>
                    <p className="text-moroccan-teal font-medium text-base md:text-lg">{v.translation}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};