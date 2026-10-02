import { useState, useRef, useCallback } from "react";

// Browser speech-to-text wrapper.
// onResult(text) fires when a final transcript is available.
// onError(message) reports microphone/recognition failures to the UI.
export function useVoice(onResult, onError) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const getRecognition = () =>
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const start = useCallback(async () => {
    const SR = getRecognition();

    if (!SR) {
      onError?.("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (listening) return;

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      const message =
        error?.name === "NotAllowedError"
          ? "Microphone access is blocked. Allow microphone access for this site and try again."
          : error?.name === "NotFoundError"
            ? "No microphone was found. Check your microphone and try again."
            : "Could not access your microphone. Check browser permissions.";
      onError?.(message);
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    rec.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) transcript += event.results[i][0]?.transcript || "";
      }
      transcript = transcript.trim();
      if (transcript) onResult?.(transcript);
      else onError?.("I could not hear a clear sentence. Please try again.");
    };

    rec.onnomatch = () => {
      onError?.("I could not understand that. Try saying “spent 250 on lunch”.");
    };

    rec.onerror = (event) => {
      const messages = {
        "not-allowed": "Microphone permission was denied. Allow microphone access for this site.",
        "audio-capture": "Your microphone could not be accessed.",
        "no-speech": "I did not hear anything. Please speak again.",
        network: "Speech recognition could not reach the speech service. Check your internet connection.",
        "language-not-supported": "English (India) speech recognition is unavailable in this browser.",
        "service-not-allowed": "The browser speech service is unavailable right now.",
        aborted: "Voice input was stopped.",
      };
      onError?.(messages[event.error] || "Voice recognition failed.");
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
      onError?.(error?.message || "Could not start voice recognition.");
    }
  }, [listening, onError, onResult]);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    setListening(false);
  }, []);

  return { listening, supported: !!getRecognition(), start, stop };
}