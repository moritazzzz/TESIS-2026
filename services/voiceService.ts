import { GoogleGenAI, Modality } from "@google/genai";
import { AssistantVoice } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

let hasInteracted = false;
let currentAudio: HTMLAudioElement | null = null;

export const enableAudio = () => {
  hasInteracted = true;
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  window.speechSynthesis.cancel();
};

let useBrowserFallbackOnly = false;
let fallbackTimeout: NodeJS.Timeout | null = null;

export const speak = async (text: string, voice: AssistantVoice): Promise<void> => {
  if (!text || !hasInteracted) return;

  stopSpeech();

  // If we recently hit a rate limit, use browser TTS immediately to avoid further errors
  if (useBrowserFallbackOnly) {
    return speakWithBrowserTTS(text);
  }

  try {
    const voiceName = voice === AssistantVoice.FEMALE ? "Kore" : "Zephyr";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioBlob = base64ToBlob(base64Audio, "audio/wav");
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudio = new Audio(audioUrl);
      return new Promise((resolve) => {
        if (!currentAudio) {
          resolve();
          return;
        }
        
        currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        currentAudio.onerror = (e) => {
          console.error("Audio play error (WAV):", e);
          URL.revokeObjectURL(audioUrl);
          speakWithBrowserTTS(text).then(resolve);
        };

        currentAudio.play().catch((playError: any) => {
          console.warn("Audio play error (WAV) - trying fallback:", playError);
          URL.revokeObjectURL(audioUrl);
          speakWithBrowserTTS(text).then(resolve);
        });
      });
    } else {
      return speakWithBrowserTTS(text);
    }
  } catch (error: any) {
    // Check for rate limit error (429)
    if (error?.message?.includes('429') || error?.status === 429 || error?.code === 429) {
      console.warn("Gemini TTS Rate limit reached. Falling back to browser TTS for 1 minute.");
      useBrowserFallbackOnly = true;
      
      // Reset fallback after 1 minute
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      fallbackTimeout = setTimeout(() => {
        useBrowserFallbackOnly = false;
      }, 60000);
    } else {
      console.error("Error generating speech:", error);
    }
    
    return speakWithBrowserTTS(text);
  }
};

const speakWithBrowserTTS = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') && v.name.includes('Google')) || 
                          voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setVoiceAndSpeak();
    }
  });
};

export const listen = (onResult: (text: string) => void, onEnd: () => void): () => void => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser.");
    onEnd();
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const result = event.results[0][0].transcript;
    onResult(result.toLowerCase());
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    onEnd();
  };

  try {
    recognition.start();
  } catch (e) {
    console.error("Error starting recognition:", e);
    onEnd();
  }

  return () => {
    recognition.stop();
  };
};

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
