import { Mic, MicOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { useVoice } from "../../hooks/useVoice.js";

// Microphone button for cross-browser voice-to-text.
export default function VoiceButton({ onText, size = 40 }) {
  const handleError = useCallback((message) => {
    toast.error(message, { duration: 4500 });
  }, []);

  const handleText = useCallback(
    (text) => {
      if (!text?.trim()) return;
      onText?.(text.trim());
    },
    [onText]
  );

  const { listening, processing, supported, start, stop } = useVoice(
    handleText,
    handleError
  );

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input is not supported in this browser"
        aria-label="Voice input is not supported"
        className="shrink-0 rounded-xl flex items-center justify-center bg-card2 text-muted opacity-50"
        style={{ width: size, height: size }}
      >
        <Mic size={18} />
      </button>
    );
  }

  const toggle = () => {
    if (processing) return;

    if (listening) {
      stop();
      return;
    }

    toast("Listening… speak now", {
      icon: "🎙️",
      duration: 1800,
    });
    start();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={processing}
      title={
        processing
          ? "Transcribing…"
          : listening
            ? "Listening… click to stop"
            : "Speak"
      }
      aria-label={
        processing
          ? "Transcribing voice"
          : listening
            ? "Stop listening"
            : "Start voice input"
      }
      className={`shrink-0 rounded-xl flex items-center justify-center transition-colors ${
        processing
          ? "bg-income/15 text-income opacity-80"
          : listening
            ? "bg-expense/20 text-expense animate-pulse"
            : "bg-card2 text-income hover:bg-card2/70"
      }`}
      style={{ width: size, height: size }}
    >
      {processing ? (
        <Loader2 size={18} className="animate-spin" />
      ) : listening ? (
        <MicOff size={18} />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
}
