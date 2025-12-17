import React, { useState, useRef } from 'react';
import { identifyRecitation, generateSpeech } from '../services/geminiService';
import { Verse } from '../types';

export const RecitationRecognizer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const finalMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMimeType });
        await handleAudioProcess(audioBlob, finalMimeType);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVerse(null);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied. Please check your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioProcess = async (blob: Blob, mimeType: string) => {
    setProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Audio = base64data.split(',')[1];
        
        try {
            const identifiedVerse = await identifyRecitation(base64Audio, mimeType);
            setVerse(identifiedVerse);
        } catch (e) {
            console.error(e);
            setError("Could not identify the recitation. Please try clearly reciting again.");
        } finally {
            setProcessing(false);
        }
      };
    } catch (e) {
      setError("Error processing audio file.");
      setProcessing(false);
    }
  };

  const playTranslation = async () => {
    if (!verse) return;
    try {
      const audioBase64 = await generateSpeech(verse.translation);
      
      // Decode raw PCM data (24kHz, 1 channel) from Gemini
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      
      const binaryString = atob(audioBase64);
      const len = binaryString.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        view[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(buffer);
      const audioBuffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start(0);

    } catch (e) {
      console.error(e);
      setError("Failed to play audio translation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 space-y-6 md:space-y-8 w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif text-moroccan-teal font-bold">Recitation Recognizer</h2>
        <p className="text-moroccan-dark/70 text-sm md:text-base">Recite a verse, and Yaya-Almajiri will identify it for you.</p>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-moroccan-gold to-moroccan-teal rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isRecording ? 'animate-pulse' : ''}`}></div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={processing}
          className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isRecording 
              ? 'bg-red-500 ring-4 ring-red-200' 
              : 'bg-moroccan-teal ring-4 ring-moroccan-gold/30'
          } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {processing ? (
             <svg className="animate-spin h-8 w-8 md:h-10 md:w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isRecording ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          )}
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-xs md:text-sm font-semibold text-moroccan-dark/50 uppercase tracking-widest mb-1">
            {isRecording ? "Listening..." : processing ? "Identifying..." : "Tap to Recite"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded w-full animate-fade-in-up text-sm">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {verse && (
        <div className="w-full bg-white bg-opacity-90 rounded-2xl shadow-xl overflow-hidden border border-moroccan-gold/20 transform transition-all duration-500 animate-fade-in-up mt-6">
          <div className="bg-moroccan-teal text-white p-4 flex justify-between items-center">
            <h3 className="text-lg md:text-xl font-bold font-serif">{verse.surahNameEn}</h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-sans whitespace-nowrap">V {verse.ayahNumber}</span>
          </div>
          <div className="p-6 md:p-8 space-y-4 md:space-y-6 text-center">
            <p className="text-3xl md:text-4xl leading-loose font-arabic text-moroccan-dark" dir="rtl">
              {verse.arabicText}
            </p>
            <div className="w-16 h-1 bg-moroccan-gold mx-auto opacity-50"></div>
            <p className="text-base md:text-lg italic text-moroccan-dark/60 font-serif">
              {verse.transliteration}
            </p>
            <p className="text-lg md:text-xl text-moroccan-dark font-medium font-sans">
              {verse.translation}
            </p>
            <div className="flex justify-center pt-4">
              <button 
                onClick={playTranslation}
                className="flex items-center space-x-2 text-moroccan-teal hover:text-moroccan-gold transition-colors bg-moroccan-teal/5 px-4 py-2 rounded-full text-sm md:text-base active:bg-moroccan-teal/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Listen to Meaning</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};