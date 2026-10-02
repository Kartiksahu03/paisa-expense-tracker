import { useState, useRef, useCallback, useEffect } from "react";

// Browser speech-to-text wrapper.
// Keeps recognition errors visible and avoids a separate getUserMedia preflight,
// which can interfere with the browser's own SpeechRecognition microphone flow.
export function useVoice(onResult, onError) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  const resultRef = useRef(onResult);
  const errorRef = useRef(onError);

  useEffect(() => {
    resultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );

    return () => {
      try {
        recRef.current?.abort();
      } catch {}
      recRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      errorRef.current?.(
        "Voice input is not supported here. Use the latest Chrome or Edge."
      );
      return;
    }

    if (recRef.current) return;

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setListening(true);
    };

    rec.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result?.isFinal) {
          transcript += result[0]?.transcript || "";
        }
      }

      transcript = transcript.trim();

      if (transcript) {
        resultRef.current?.(transcript);
      }
    };

    rec.onnomatch = () => {
      errorRef.current?.(
        'I could not understand that. Try saying "spent 250 on lunch".'
      );
    };

    rec.onerror = (event) => {
      const messages = {
        "not-allowed":
          "Microphone access is blocked for Paisa. Click the lock icon beside the address bar → Microphone → Allow, then reload.",
        "service-not-allowed":
          "Chrome's speech recognition service is unavailable. Check your internet connection and try again.",
        "audio-capture":
          "Paisa could not access your microphone. Check that the correct microphone is connected.",
        "no-speech":
          "I did not hear speech. Click the mic and speak clearly after it starts listening.",
        network:
          "Speech recognition could not reach the browser speech service. Check your internet connection.",
        "language-not-supported":
          "English (India) speech recognition is unavailable. Try Chrome/Edge with English enabled.",
        aborted: "Voice input was stopped.",
      };

      errorRef.current?.(
        messages[event?.error] || `Voice recognition failed: ${event?.error || "unknown error"}`
      );
    };

    rec.onend = () => {
      setListening(false);
      if (recRef.current === rec) recRef.current = null;
    };

    recRef.current = rec;

    try {
      rec.start();
    } catch (error) {
      recRef.current = null;
      setListening(false);
      errorRef.current?.(
        error?.message || "Could not start voice recognition. Try again."
      );
    }
  }, []);

  const stop = useCallback(() => {
    const rec = recRef.current;
    recRef.current = null;
    setListening(false);

    try {
      rec?.stop();
    } catch {}
  }, []);

  return { listening, supported, start, stop };
}
