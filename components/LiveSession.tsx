import React, { useEffect, useRef, useState } from 'react';
import { connectLiveSession } from '../services/geminiService';

// Audio Helpers for Live API
const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const createPcmBlob = (data: Float32Array): { data: string, mimeType: string } => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
};

const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Ready to start session");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const inputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentSessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      setStatus("Connecting...");
      
      // Output Audio Setup
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      await audioContextRef.current.resume();
      nextStartTimeRef.current = 0;

      // Input Audio Setup
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      await inputContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = inputContextRef.current.createMediaStreamSource(stream);
      const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = createPcmBlob(inputData);
        
        if (currentSessionRef.current) {
          currentSessionRef.current.sendRealtimeInput({ media: pcmData });
        }
      };

      source.connect(processor);
      processor.connect(inputContextRef.current.destination);

      // Connect to Gemini
      const sessionPromise = connectLiveSession(
        async (base64Audio) => {
           if (!audioContextRef.current) return;
           
           const ctx = audioContextRef.current;
           const bytes = decodeBase64(base64Audio);
           const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
           
           const outputSource = ctx.createBufferSource();
           outputSource.buffer = audioBuffer;
           outputSource.connect(ctx.destination);
           
           nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
           outputSource.start(nextStartTimeRef.current);
           nextStartTimeRef.current += audioBuffer.duration;
        },
        () => {
           setIsActive(false);
           setStatus("Session ended.");
           stopSession(); 
        }
      );
      
      sessionPromiseRef.current = sessionPromise;
      
      sessionPromise.then(session => {
        currentSessionRef.current = session;
        setStatus("Live Session Active");
        setIsActive(true);
      }).catch(err => {
        console.error("Connection failed", err);
        setStatus("Failed to connect");
        stopSession();
      });

    } catch (e) {
      console.error(e);
      setStatus("Failed to connect: " + (e as Error).message);
      setIsActive(false);
    }
  };

  const stopSession = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputContextRef.current) {
      await inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (currentSessionRef.current) {
       try {
         if (typeof currentSessionRef.current.close === 'function') {
           currentSessionRef.current.close();
         }
       } catch (e) {
         console.log("Error closing session object", e);
       }
       currentSessionRef.current = null;
    }
    
    setIsActive(false);
    setStatus("Session Stopped");
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 text-center space-y-6 md:space-y-8 max-w-2xl mx-auto animate-fade-in-up w-full">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif text-moroccan-teal font-bold">Live Tutor Session</h2>
        <p className="text-gray-600 text-sm md:text-base">Have a real-time conversation with Yaya-Almajiri.</p>
      </div>
      
      <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 flex items-center justify-center transition-all duration-1000 ${isActive ? 'border-moroccan-gold animate-pulse bg-moroccan-teal/5' : 'border-gray-200 bg-gray-50'}`}>
        {isActive ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-32 md:w-32 text-moroccan-teal animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-32 md:w-32 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
        )}
      </div>

      <div className="text-lg md:text-xl font-bold text-moroccan-dark">{status}</div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`w-full md:w-auto px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-transform transform active:scale-95 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-moroccan-teal hover:bg-teal-700'}`}
      >
        {isActive ? "End Session" : "Start Live Session"}
      </button>
      
      {!isActive && (
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Use headphones for best results to avoid echo.
        </p>
      )}
    </div>
  );
};