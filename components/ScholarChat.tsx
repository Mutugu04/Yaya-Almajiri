import React, { useState, useRef, useEffect } from 'react';
import { askScholar } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ScholarChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'As-salamu alaykum. I am your AI Scholar assistant. Ask me anything about the Quran, Hadith, or Islamic history.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await askScholar(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I apologize, I could not generate an answer at this moment."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100dvh-120px)] flex flex-col bg-white rounded-xl shadow-2xl border border-moroccan-gold/20 overflow-hidden md:mb-4">
        {/* Header */}
        <div className="bg-moroccan-teal p-3 md:p-4 flex items-center shadow-md z-10 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-moroccan-gold flex items-center justify-center text-white mr-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
            </div>
            <div className="min-w-0">
                <h3 className="font-bold text-white text-sm md:text-base truncate">AI Scholar</h3>
                <p className="text-xs text-moroccan-sand truncate">Powered by Gemini 3.0 Thinking</p>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth" ref={scrollRef}>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md text-sm md:text-base relative ${
                        msg.role === 'user' 
                        ? 'bg-moroccan-teal text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}>
                        <div className="markdown prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap break-words">
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-moroccan-teal rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-moroccan-teal rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-moroccan-teal rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white border-t border-gray-200 shrink-0 safe-area-bottom">
            <div className="flex items-center space-x-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask a question..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-moroccan-teal focus:ring-2 focus:ring-moroccan-teal/20 text-sm md:text-base bg-gray-50 text-gray-900"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-moroccan-gold hover:bg-yellow-600 text-white p-3 rounded-full shadow-md transition-colors disabled:opacity-50 shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};