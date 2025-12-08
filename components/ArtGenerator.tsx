import React, { useState, useEffect } from 'react';
import { generateIslamicArt } from '../services/geminiService';

export const ArtGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
        // Fallback for dev environments where aistudio might not be injected
        setHasKey(true); 
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      await checkKey();
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    // Safety check for key
    if (window.aistudio && !hasKey) {
        await handleSelectKey();
        if (!await window.aistudio.hasSelectedApiKey()) return;
    }

    setLoading(true);
    setImageUrl(null);
    try {
      const url = await generateIslamicArt(prompt, size);
      setImageUrl(url);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('Requested entity was not found') || e.message?.includes('404')) {
         alert("API Key issue. Please select your paid project key again.");
         await handleSelectKey();
      } else {
         alert("Failed to generate image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start p-4">
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-moroccan-gold/20">
            <h2 className="text-2xl font-bold text-moroccan-teal mb-4 font-serif">Islamic Art Studio</h2>
            <p className="text-gray-600 text-sm mb-6">
                Create 1K, 2K, or 4K geometric masterpieces using Gemini 3 Pro.
                <span className="block mt-2 text-xs text-moroccan-gold">Requires a paid Google Cloud Project API Key.</span>
            </p>
            
            <div className="space-y-4">
                {!hasKey && (
                     <button 
                        onClick={handleSelectKey}
                        className="w-full bg-moroccan-dark text-white p-2 rounded text-sm mb-4 hover:bg-black transition-colors"
                     >
                        Connect Billing Project
                     </button>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-moroccan-teal focus:outline-none"
                        placeholder="e.g. A golden mosque at sunset with geometric zellige patterns..."
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <div className="flex space-x-2">
                    {(['1K', '2K', '4K'] as const).map((s) => (
                      <button 
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${size === s ? 'bg-moroccan-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full bg-moroccan-gold hover:bg-yellow-600 text-white font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span>Generate Artwork</span>
                    )}
                </button>
                <div className="text-center mt-2">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:underline">
                        Pricing & Billing Info
                    </a>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <div className="bg-white p-2 rounded-xl shadow-xl border-4 border-moroccan-dark min-h-[400px] flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            {imageUrl ? (
                <img src={imageUrl} alt="Generated Art" className="w-full h-auto rounded shadow-inner" />
            ) : (
                <div className="text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Art will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
