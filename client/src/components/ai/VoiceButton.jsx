import { Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { useVoice } from "../../hooks/useVoice.js";

// Microphone button for browser speech-to-text.
export default function VoiceButton({ onText, size = 40 }) {
  const handleError = useCallback((message) => {
    toast.error(message, { duration: 3500 });
  }, []);

  const { listening, supported, start, stop } = useVoice(onText, handleError);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      title={listening ? "Listening… tap to stop" : "Speak"}
      aria-label={listening ? "Stop listening" : "Start voice input"}
      className={`shrink-0 rounded-xl flex items-center justify-center transition-colors ${
        listening
          ? "bg-expense/20 text-expense animate-pulse"
          : "bg-card2 text-income hover:bg-card2/70"
      }`}
      style={{ width: size, height: size }}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}