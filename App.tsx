import React, { useState } from 'react';
import { RecitationRecognizer } from './components/RecitationRecognizer';
import { QuranReader } from './components/QuranReader';
import { ScholarChat } from './components/ScholarChat';
import { LiveSession } from './components/LiveSession';
import { PrayerDashboard } from './components/PrayerDashboard';
import { AzkarBook } from './components/AzkarBook';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    switch (mode) {
      case AppMode.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 md:space-y-6 animate-fade-in-up py-4">
            <h1 className="text-4xl md:text-6xl font-arabic text-moroccan-teal drop-shadow-sm font-bold leading-tight mt-2">Almajir</h1>
            <p className="text-base md:text-lg font-serif text-moroccan-dark max-w-xl leading-relaxed px-4 opacity-80">
              Seek knowledge, connect with the Quran, and find your way.
            </p>
            
            {/* 3D Grid Layout: 2 Columns, 3 Rows */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mt-6 px-4">
               {/* 1. Recite */}
               <button onClick={() => setMode(AppMode.RECOGNITION)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white shadow-[0_6px_0_0_#6b21a8] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">اقرأ</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">🎤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Recite</h3>
                    <p className="text-white/70 text-xs mt-1">Identify verses</p>
                  </div>
               </button>

               {/* 2. Read */}
               <button onClick={() => setMode(AppMode.READER)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-teal-500 to-emerald-700 text-white shadow-[0_6px_0_0_#047857] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">كتاب</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Quran</h3>
                    <p className="text-white/70 text-xs mt-1">Full Reader</p>
                  </div>
               </button>

               {/* 3. Prayer */}
               <button onClick={() => setMode(AppMode.PRAYER)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-[0_6px_0_0_#1d4ed8] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">صلاة</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">🕌</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Prayer</h3>
                    <p className="text-white/70 text-xs mt-1">Times & Qibla</p>
                  </div>
               </button>

               {/* 4. Scholar */}
               <button onClick={() => setMode(AppMode.CHAT)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-[0_6px_0_0_#c2410c] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">علم</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Scholar</h3>
                    <p className="text-white/70 text-xs mt-1">AI Assistant</p>
                  </div>
               </button>

               {/* 5. Live */}
               <button onClick={() => setMode(AppMode.LIVE)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-[0_6px_0_0_#be123c] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">تكلم</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Live Tutor</h3>
                    <p className="text-white/70 text-xs mt-1">Real-time</p>
                  </div>
               </button>
               
               {/* 6. Azkar (New) */}
               <button onClick={() => setMode(AppMode.AZKAR)} className="group relative overflow-hidden p-4 rounded-xl transition-all bg-gradient-to-br from-cyan-600 to-sky-800 text-white shadow-[0_6px_0_0_#0369a1] active:shadow-none active:translate-y-[6px] hover:-translate-y-1 min-h-[100px] flex flex-col justify-between items-start">
                  <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 font-arabic rotate-12">ذكر</div>
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-xl">📿</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-serif leading-none">Azkar</h3>
                    <p className="text-white/70 text-xs mt-1">Daily Fortress</p>
                  </div>
               </button>
            </div>
          </div>
        );
      case AppMode.RECOGNITION:
        return <RecitationRecognizer />;
      case AppMode.READER:
        return <QuranReader />;
      case AppMode.CHAT:
        return <ScholarChat />;
      case AppMode.LIVE:
        return <LiveSession />;
      case AppMode.PRAYER:
        return <PrayerDashboard />;
      case AppMode.AZKAR:
        return <AzkarBook />;
      default:
        return <div />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-moroccan-dark relative">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-moroccan-gold/30 h-16 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => setMode(AppMode.HOME)}>
              <div className="w-8 h-8 bg-moroccan-teal rounded-lg flex items-center justify-center text-white font-arabic text-xl font-bold mr-2 shadow-sm shrink-0 transition-transform group-hover:rotate-12">
                ع
              </div>
              <span className="font-bold text-xl tracking-tight text-moroccan-teal font-serif truncate">Almajir</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { m: AppMode.HOME, l: 'Home' },
                { m: AppMode.RECOGNITION, l: 'Recite' },
                { m: AppMode.READER, l: 'Read' },
                { m: AppMode.PRAYER, l: 'Prayer' },
                { m: AppMode.AZKAR, l: 'Azkar' },
                { m: AppMode.CHAT, l: 'Scholar' },
                { m: AppMode.LIVE, l: 'Live' },
              ].map(item => (
                <button
                  key={item.m}
                  onClick={() => setMode(item.m)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === item.m 
                    ? 'text-white bg-moroccan-teal font-bold shadow-sm' 
                    : 'text-gray-600 hover:text-moroccan-teal hover:bg-moroccan-base'
                  }`}
                >
                  {item.l}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-moroccan-teal focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-50 animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { m: AppMode.HOME, l: 'Home' },
                { m: AppMode.RECOGNITION, l: 'Recite' },
                { m: AppMode.READER, l: 'Read' },
                { m: AppMode.PRAYER, l: 'Prayer Times' },
                { m: AppMode.AZKAR, l: 'Azkar' },
                { m: AppMode.CHAT, l: 'Scholar Chat' },
                { m: AppMode.LIVE, l: 'Live Tutor' },
              ].map(item => (
                <button
                  key={item.m}
                  onClick={() => { setMode(item.m); setIsMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium active:bg-gray-100 ${
                    mode === item.m 
                    ? 'text-moroccan-teal bg-moroccan-teal/10 font-bold' 
                    : 'text-gray-600'
                  }`}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-4 px-0 md:px-4 relative z-10">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-moroccan-dark text-moroccan-sand py-4 md:py-6 mt-auto relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif italic opacity-80 text-xs md:text-sm">"Seek knowledge from the cradle to the grave"</p>
          <p className="text-[10px] md:text-xs mt-2 opacity-50">&copy; 2024 Almajir.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;