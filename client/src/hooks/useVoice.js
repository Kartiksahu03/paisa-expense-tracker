import { useState, useRef, useCallback } from "react";

// Wraps the browser SpeechRecognition API. onResult(text) fires with the transcript.
export function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = useCallback(() => {
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [SR, onResult]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, supported: !!SR, start, stop };
}
