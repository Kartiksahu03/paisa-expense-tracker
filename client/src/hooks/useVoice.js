import { useState, useRef, useCallback, useEffect } from "react";
import api from "../services/axios.js";

// Cross-browser voice input.
// Records from the microphone with MediaRecorder and sends the audio to
// Paisa's backend, where Groq Whisper performs the transcription.
// This avoids browser-specific SpeechRecognition service failures.
export function useVoice(onResult, onError) {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [supported, setSupported] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
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
        !!navigator.mediaDevices?.getUserMedia &&
        typeof window.MediaRecorder !== "undefined"
    );

    return () => {
      clearTimeout(timerRef.current);
      try {
        recorderRef.current?.stop();
      } catch {}
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
      streamRef.current = null;
    };
  }, []);

  const finishRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    clearTimeout(timerRef.current);
    recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (recorderRef.current || processing) return;

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      errorRef.current?.("Voice recording is not supported in this browser.");
      return;
    }

    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeCandidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      const mimeType =
        mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        streamRef.current = null;
        setListening(false);
        setProcessing(false);
        errorRef.current?.("Voice recording failed. Check your microphone and try again.");
      };

      recorder.onstart = () => {
        setListening(true);
      };

      recorder.onstop = async () => {
        setListening(false);
        setProcessing(true);

        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });
        chunksRef.current = [];

        if (!blob.size) {
          setProcessing(false);
          errorRef.current?.("No audio was recorded. Please try again.");
          return;
        }

        try {
          const response = await api.post("/ai/transcribe", blob, {
            headers: {
              "Content-Type": blob.type || "audio/webm",
            },
            timeout: 30000,
            maxBodyLength: 25 * 1024 * 1024,
          });

          const text = response.data?.text?.trim();

          if (!text) {
            errorRef.current?.("I could not hear any words. Please speak clearly and try again.");
          } else {
            resultRef.current?.(text);
          }
        } catch (error) {
          const status = error?.response?.status;
          const message =
            error?.response?.data?.message ||
            (status === 401
              ? "Your session expired. Please log in again."
              : "Voice transcription failed. Please try again.");
          errorRef.current?.(message);
        } finally {
          setProcessing(false);
        }
      };

      recorder.start();
      // Keep recordings short for fast transcription and low API usage.
      timerRef.current = setTimeout(finishRecording, 10000);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
      streamRef.current = null;

      const message =
        error?.name === "NotAllowedError"
          ? "Microphone access is blocked for Paisa. Allow microphone access for this site, then try again."
          : error?.name === "NotFoundError"
            ? "No microphone was found. Check your microphone and try again."
            : "Could not access your microphone. Check browser permissions.";

      errorRef.current?.(message);
    }
  }, [finishRecording, processing]);

  const stop = useCallback(() => {
    finishRecording();
  }, [finishRecording]);

  return { listening, processing, supported, start, stop };
}
