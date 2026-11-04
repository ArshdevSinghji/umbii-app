import { errorToast } from "@/components/ui/app-toaster";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";

// idle → listening → (stop / send) finishing → idle. Cancel goes straight to idle.
export type VoiceInputStatus = "idle" | "listening" | "finishing";

// `volumechange` reports Android's mic level in dB, about -2..10.
const MAX_DB = 10;
// Above the room's own noise, quieter than this is still silence.
const SPEECH_MARGIN_DB = 1;
// How fast the noise floor creeps back up (dB per reading, every 50ms), so
// it follows a room getting louder without counting long speech as noise.
const FLOOR_RISE_DB = 0.01;

// Volume above the noise floor as 0..1. Square-rooted so quiet speech still
// shows clearly (loudness is perceived roughly that way).
const toLevel = (db: number, floor: number) => {
  const range = MAX_DB - floor - SPEECH_MARGIN_DB;
  const level = (db - floor - SPEECH_MARGIN_DB) / range;
  return Math.sqrt(Math.min(1, Math.max(0, level)));
};

// Errors that aren't failures: the user cancelled, or said nothing (the empty
// transcript already covers that).
const QUIET_ERRORS = new Set(["aborted", "no-speech", "speech-timeout"]);

// Dictation for the food input: on-device speech-to-text, plus a live volume
// level for the waveform. Transcribes only; the caller decides what to do
// with the text.
export function useVoiceInput() {
  const [status, setStatus] = useState<VoiceInputStatus>("idle");
  const level = useSharedValue(0);
  // The room's background level in dB: drops to any quieter reading at once
  // and rises slowly, so steady noise (a fan, traffic) reads as silence.
  const noiseFloor = useRef(0);

  // Android's continuous mode reports in segments: each final result closes
  // one and later results start the next, so finals are appended. iOS sends a
  // single final result with everything.
  const finalText = useRef("");
  const interimText = useRef("");
  // Set by `finish`; called with the transcript once recognition has ended.
  const onFinished = useRef<((text: string) => void) | null>(null);

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript.trim() ?? "";
    if (event.isFinal) {
      finalText.current = [finalText.current, transcript]
        .filter(Boolean)
        .join(" ");
      interimText.current = "";
    } else {
      interimText.current = transcript;
    }
  });

  useSpeechRecognitionEvent("volumechange", (event) => {
    noiseFloor.current = Math.min(
      event.value,
      noiseFloor.current + FLOOR_RISE_DB,
    );
    level.set(toLevel(event.value, noiseFloor.current));
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (QUIET_ERRORS.has(event.error)) return;
    errorToast("Voice input stopped", {
      id: "voice-input",
      description: event.message,
    });
  });

  // Always the last event, after errors too.
  useSpeechRecognitionEvent("end", () => {
    level.set(0);
    setStatus("idle");
    const text = [finalText.current, interimText.current]
      .filter(Boolean)
      .join(" ");
    onFinished.current?.(text);
    onFinished.current = null;
  });

  // Don't leave the mic on if the screen goes away mid-recording.
  useEffect(() => () => ExpoSpeechRecognitionModule.abort(), []);

  const start = async () => {
    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      errorToast("Microphone access needed", {
        id: "voice-input",
        description:
          "Allow microphone and speech recognition in Settings to log meals by voice.",
      });
      return;
    }
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      errorToast("Voice input isn't available", {
        id: "voice-input",
        description: "This device has no speech recognition service.",
      });
      return;
    }

    finalText.current = "";
    interimText.current = "";
    noiseFloor.current = 0;
    onFinished.current = null;
    setStatus("listening");
    ExpoSpeechRecognitionModule.start({
      interimResults: true,
      // Keeps listening through pauses until the user stops it. Also mutes
      // Android's start/stop beep.
      continuous: true,
      iosTaskHint: "dictation",
      volumeChangeEventOptions: { enabled: true, intervalMillis: 50 },
    });
  };

  // Stops listening and resolves with the transcript ("" if nothing was heard).
  const finish = () =>
    new Promise<string>((resolve) => {
      onFinished.current = resolve;
      setStatus("finishing");
      ExpoSpeechRecognitionModule.stop();
    });

  // Discards the recording.
  const cancel = () => {
    onFinished.current = null;
    setStatus("idle");
    ExpoSpeechRecognitionModule.abort();
  };

  return { status, level, start, finish, cancel };
}
