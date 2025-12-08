import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { Verse } from "../types";

// Helper to clean JSON strings from Markdown code blocks
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return cleaned.trim();
};

// --- 1. Recitation Recognition (Audio -> Verse) ---
// Using gemini-2.5-flash for speed and multimodal audio reliability
export const identifyRecitation = async (base64Audio: string, mimeType: string): Promise<Verse> => {
  // Always create a new instance to ensure we use the latest env vars if they change
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Listen to this Quranic recitation. 
    Identify the exact Surah (chapter) and Ayah (verse) being recited.
    Return the result in JSON format.
    Fields required: surahNumber, ayahNumber, surahNameAr, surahNameEn, arabicText, translation, transliteration.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            surahNumber: { type: Type.INTEGER },
            ayahNumber: { type: Type.INTEGER },
            surahNameAr: { type: Type.STRING },
            surahNameEn: { type: Type.STRING },
            arabicText: { type: Type.STRING },
            translation: { type: Type.STRING },
            transliteration: { type: Type.STRING },
          },
          required: ["surahNumber", "ayahNumber", "surahNameAr", "surahNameEn", "arabicText", "translation", "transliteration"]
        }
      }
    });

    if (response.text) {
      const cleanedText = cleanJson(response.text);
      return JSON.parse(cleanedText) as Verse;
    }
  } catch (error) {
    console.error("Recitation identification failed:", error);
    throw new Error("Could not identify recitation. Please try again clearly.");
  }
  throw new Error("Could not identify recitation");
};

// --- 2. Quran Content Generation (for Reader) ---
// Uses gemini-2.5-flash-lite for fast retrieval
export const getSurahContent = async (surahNumber: number): Promise<Verse[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-lite";
  
  const prompt = `
    Provide the first 15 verses of Surah number ${surahNumber}.
    Return a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              surahNumber: { type: Type.INTEGER },
              ayahNumber: { type: Type.INTEGER },
              surahNameAr: { type: Type.STRING },
              surahNameEn: { type: Type.STRING },
              arabicText: { type: Type.STRING },
              translation: { type: Type.STRING },
              transliteration: { type: Type.STRING },
            }
          }
        }
      }
    });

    if (response.text) {
      const cleanedText = cleanJson(response.text);
      return JSON.parse(cleanedText) as Verse[];
    }
  } catch (error) {
    console.error("Failed to fetch surah content:", error);
  }
  return [];
};

// --- 3. Scholar Chat (Thinking Mode) ---
// Uses gemini-3-pro-preview with HIGH thinking budget
export const askScholar = async (history: {role: string, parts: {text: string}[]}[], question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
    }
  });

  const result = await chat.sendMessage({ message: question });
  return result.text;
};

// --- 4. Text to Speech ---
// Uses gemini-2.5-flash-preview-tts
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-preview-tts";
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: text }]
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
};

// --- 5. Image Generation ---
// Uses gemini-3-pro-image-preview
// IMPORTANT: This call relies on the API KEY selected via window.aistudio.openSelectKey() in the UI.
export const generateIslamicArt = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  // Re-initialize client to pick up the potentially newly selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-image-preview";
  
  const fullPrompt = `Create a beautiful, respectful Islamic art piece or calligraphy based on this theme: ${prompt}. 
  Style: Moroccan Zellige, Arabesque, or Ottoman illumination. High detail, warm lighting.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: fullPrompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  // Find the image part
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// --- 6. Live API Setup ---
// Returns the session promise
export const connectLiveSession = async (
  onAudioData: (base64: string) => void,
  onClose: () => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-native-audio-preview-09-2025";
  
  return ai.live.connect({
    model: model,
    callbacks: {
      onopen: () => {
        console.log("Live session opened");
      },
      onmessage: (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          onAudioData(base64Audio);
        }
      },
      onclose: () => {
        console.log("Live session closed");
        onClose();
      },
      onerror: (err) => {
        console.error("Live session error", err);
        onClose();
      }
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction: "You are a helpful Quran tutor. Listen to the user recite (or speak) and help them improve, or discuss verses. Be polite, encouraging, and respectful."
    }
  });
};
