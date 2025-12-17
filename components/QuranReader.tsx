import React, { useState, useEffect, useRef } from 'react';
import { getAllSurahs, getSurahVerses, getAudioUrl } from '../services/externalApiService';
import { Verse, SurahMeta } from '../types';

export const QuranReader: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      const list = await getAllSurahs();
      setSurahs(list);
    };
    fetchList();
  }, []);

  const handleSelectSurah = async (surah: SurahMeta) => {
    setSelectedSurah(surah);
    setLoading(true);
    setVerses([]);
    
    // Stop previous audio
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);

    try {
      const content = await getSurahVerses(surah.number);
      setVerses(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Reset audio when surah changes
  useEffect(() => {
    if (selectedSurah && audioRef.current) {
        audioRef.current.load();
    }
  }, [selectedSurah]);

  const handleBackToMenu = () => {
    setSelectedSurah(null);
    if (audioRef.current) {
        audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
            .then(() => setIsPlaying(true))
            .catch(error => console.error("Audio play failed", error));
        }
    }
  };

  return (
    <div className="flex h-[calc(100dvh-120px)] w-full max-w-7xl mx-auto gap-4 p-2 md:p-4">
      {/* Sidebar List */}
      <div className={`
        ${selectedSurah ? 'hidden md:flex' : 'flex'} 
        w-full md:w-1/4 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-moroccan-gold/20 overflow-hidden flex-col
      `}>
        <div className="bg-moroccan-teal p-4 text-white font-serif text-lg font-bold flex justify-between items-center shrink-0">
          <span>Surahs</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">114 Total</span>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2 scrollbar-hide">
          {surahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSelectSurah(surah)}
              className={`w-full text-left p-3 rounded-lg transition-all border border-transparent ${
                selectedSurah?.number === surah.number
                  ? 'bg-moroccan-sand text-moroccan-teal font-bold shadow-sm ring-1 ring-moroccan-gold/50'
                  : 'hover:bg-moroccan-base hover:border-moroccan-gold/30 text-moroccan-dark bg-white/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moroccan-teal/10 text-xs font-bold shrink-0">
                    {surah.number}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{surah.englishName}</p>
                        <p className="text-xs text-gray-500 truncate">{surah.englishNameTranslation}</p>
                    </div>
                </div>
                <div className="text-right pl-2">
                    <p className="font-arabic text-lg leading-none">{surah.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{surah.revelationType}</p>
                </div>
              </div>
            </button>
          ))}
          {surahs.length === 0 && (
              <div className="p-4 text-center text-gray-500">Loading Surahs...</div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={`
        ${!selectedSurah ? 'hidden md:flex' : 'flex'} 
        w-full md:flex-1 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-moroccan-gold/20 overflow-hidden flex-col relative
      `}>
        {!selectedSurah ? (
          <div className="flex flex-col items-center justify-center h-full text-moroccan-dark/50 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 opacity-30 text-moroccan-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-2xl font-serif text-moroccan-teal">Select a Surah to read</p>
            <p className="text-sm mt-2 opacity-70">Complete Quran with Translation & Audio</p>
          </div>
        ) : (
          <>
            {/* Header with Player */}
            <div className="bg-moroccan-sand/20 p-4 border-b border-moroccan-gold/20 relative shrink-0">
               <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={handleBackToMenu}
                        className="md:hidden text-moroccan-teal hover:text-moroccan-dark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="text-center flex-1">
                        <h2 className="text-2xl md:text-3xl font-arabic text-moroccan-teal font-bold">{selectedSurah.name}</h2>
                        <p className="text-moroccan-dark text-sm">{selectedSurah.englishName} • {selectedSurah.numberOfAyahs} Verses</p>
                    </div>
                    <div className="w-6 md:w-0"></div> {/* Spacer */}
               </div>
               
               {/* Audio Player Control */}
               <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex justify-center items-center space-x-6">
                        <audio 
                            ref={audioRef} 
                            key={selectedSurah.number} // Force remount on surah change
                            src={getAudioUrl(selectedSurah.number)} 
                            onEnded={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            preload="auto"
                        />
                        <button 
                            onClick={toggleAudio} 
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 border-4 ${isPlaying ? 'bg-red-500 border-red-200 animate-pulse' : 'bg-moroccan-teal border-teal-100'}`}
                        >
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white pl-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="text-xs text-moroccan-dark font-medium opacity-70">
                        Recitation by Mishary Rashid Alafasy
                    </div>
               </div>
            </div>
            
            {/* Verses List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-white/50">
              {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                 <div className="text-center py-4">
                     <p className="text-2xl font-arabic text-moroccan-dark/80">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                     </p>
                 </div>
               )}
              
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex flex-col space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-full ml-auto"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                verses.map((v) => (
                  <div key={v.ayahNumber} className="border-b border-gray-100 pb-4 last:border-0 hover:bg-white p-3 rounded-lg transition-colors group">
                    <div className="flex justify-between items-center mb-2">
                        <span className="bg-moroccan-gold/10 text-moroccan-dark px-2 py-0.5 rounded text-[10px] font-bold">
                            {selectedSurah.number}:{v.ayahNumber}
                        </span>
                    </div>
                    {/* Compact yet readable layout */}
                    <div className="space-y-2">
                        <p className="text-2xl md:text-3xl text-right font-arabic leading-relaxed text-moroccan-dark" dir="rtl">
                        {v.arabicText} 
                        </p>
                        <p className="text-moroccan-teal font-sans text-sm md:text-base leading-snug opacity-90">{v.translation}</p>
                    </div>
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