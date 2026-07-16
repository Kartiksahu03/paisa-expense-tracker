import { Mic, MicOff } from "lucide-react";
import { useVoice } from "../../hooks/useVoice.js";

// mic button; calls onText(transcript) when speech is recognized
export default function VoiceButton({ onText, size = 40 }) {
  const { listening, supported, start, stop } = useVoice(onText);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      title={listening ? "Listening… tap to stop" : "Speak your transaction"}
      className={`shrink-0 rounded-xl flex items-center justify-center transition-colors ${
        listening ? "bg-expense/20 text-expense animate-pulse" : "bg-card2 text-income hover:bg-card2/70"
      }`}
      style={{ width: size, height: size }}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}
