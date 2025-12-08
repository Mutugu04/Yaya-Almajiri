import React, { useState } from 'react';
import { RecitationRecognizer } from './components/RecitationRecognizer';
import { QuranReader } from './components/QuranReader';
import { ScholarChat } from './components/ScholarChat';
import { LiveSession } from './components/LiveSession';
import { ArtGenerator } from './components/ArtGenerator';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    switch (mode) {
      case AppMode.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 md:space-y-8 animate-fade-in-up py-4">
            <h1 className="text-4xl md:text-7xl font-arabic text-moroccan-teal drop-shadow-sm font-bold leading-tight">Yaya-Almajiri</h1>
            <p className="text-lg md:text-2xl font-serif text-moroccan-dark max-w-2xl leading-relaxed px-4">
              Your intelligent companion for the Holy Quran. Listen, read, reflect, and learn with advanced AI.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8 px-4">
               <button onClick={() => setMode(AppMode.RECOGNITION)} className="p-4 md:p-6 bg-white hover:bg-moroccan-teal hover:text-white rounded-xl shadow-md transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-3xl md:text-4xl mb-2">🎤</div>
                  <h3 className="font-bold text-lg">Recognize Verse</h3>
                  <p className="text-sm opacity-70 group-hover:opacity-90">Recite and identify instantly</p>
               </button>
               <button onClick={() => setMode(AppMode.READER)} className="p-4 md:p-6 bg-white hover:bg-moroccan-teal hover:text-white rounded-xl shadow-md transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-3xl md:text-4xl mb-2">📖</div>
                  <h3 className="font-bold text-lg">Quran Reader</h3>
                  <p className="text-sm opacity-70 group-hover:opacity-90">Browse Surahs with translations</p>
               </button>
               <button onClick={() => setMode(AppMode.CHAT)} className="p-4 md:p-6 bg-white hover:bg-moroccan-teal hover:text-white rounded-xl shadow-md transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-3xl md:text-4xl mb-2">💡</div>
                  <h3 className="font-bold text-lg">Scholar Chat</h3>
                  <p className="text-sm opacity-70 group-hover:opacity-90">Deep questions & answers</p>
               </button>
               <button onClick={() => setMode(AppMode.LIVE)} className="p-4 md:p-6 bg-white hover:bg-moroccan-teal hover:text-white rounded-xl shadow-md transition-all group flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-3xl md:text-4xl mb-2">⚡</div>
                  <h3 className="font-bold text-lg">Live Tutor</h3>
                  <p className="text-sm opacity-70 group-hover:opacity-90">Real-time voice conversation</p>
               </button>
               <button onClick={() => setMode(AppMode.ART)} className="p-4 md:p-6 bg-white hover:bg-moroccan-teal hover:text-white rounded-xl shadow-md transition-all group flex flex-col items-center md:items-start text-center md:text-left md:col-span-2">
                  <div className="text-3xl md:text-4xl mb-2">🎨</div>
                  <h3 className="font-bold text-lg">Islamic Art Studio</h3>
                  <p className="text-sm opacity-70 group-hover:opacity-90">Generate geometric art with AI</p>
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
      case AppMode.ART:
        return <ArtGenerator />;
      default:
        return <div />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-moroccan-dark relative">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-moroccan-gold/30 h-16 md:h-20 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setMode(AppMode.HOME)}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-moroccan-teal rounded-lg flex items-center justify-center text-white font-arabic text-xl md:text-2xl font-bold mr-2 md:mr-3 shadow-sm shrink-0">
                ي
              </div>
              <span className="font-bold text-xl md:text-2xl tracking-tight text-moroccan-teal font-serif truncate">Yaya-Almajiri</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { m: AppMode.HOME, l: 'Home' },
                { m: AppMode.RECOGNITION, l: 'Recite' },
                { m: AppMode.READER, l: 'Read' },
                { m: AppMode.CHAT, l: 'Scholar' },
                { m: AppMode.LIVE, l: 'Live' },
                { m: AppMode.ART, l: 'Art' },
              ].map(item => (
                <button
                  key={item.m}
                  onClick={() => setMode(item.m)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === item.m 
                    ? 'text-moroccan-teal bg-moroccan-teal/10 font-bold' 
                    : 'text-gray-600 hover:text-moroccan-teal'
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
                { m: AppMode.CHAT, l: 'Scholar' },
                { m: AppMode.LIVE, l: 'Live' },
                { m: AppMode.ART, l: 'Art' },
              ].map(item => (
                <button
                  key={item.m}
                  onClick={() => { setMode(item.m); setIsMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium active:bg-gray-100 ${
                    mode === item.m 
                    ? 'text-moroccan-teal bg-moroccan-teal/10' 
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
      <main className="flex-1 w-full max-w-7xl mx-auto py-4 md:py-8 px-0 md:px-6 lg:px-8 relative z-10">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-moroccan-dark text-moroccan-sand py-6 md:py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-serif italic opacity-80 text-sm md:text-base">"Read! In the name of your Lord who created..."</p>
          <p className="text-xs md:text-sm mt-4 opacity-50">&copy; 2024 Yaya-Almajiri. Built with Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;