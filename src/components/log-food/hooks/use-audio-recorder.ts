import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  useAudioStream,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export function useAudioRecorderHook() {
  const [hasPermission, setHasPermission] = useState(false);
  const audioLevelRef = useRef(0); // ref instead of state — no re-render batching delay

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(audioRecorder, 100);

  const { stream } = useAudioStream({
    sampleRate: 16000,
    channels: 1,
    encoding: "float32",
    onBuffer: (buffer) => {
      const samples = new Float32Array(buffer.data.slice(0)); // slice to copy before bridge invalidates it
      if (samples.length === 0) return;

      const rms = Math.sqrt(
        samples.reduce((sum, s) => sum + s * s, 0) / samples.length
      );
      audioLevelRef.current = Math.min(1, rms * 10); // boost sensitivity
    },
  });

  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync().then((status) => {
      setHasPermission(status.granted);
      if (!status.granted) {
        Alert.alert(
          "Microphone Permission",
          "Please allow microphone access in settings."
        );
      }
    });
  }, []);

  const startRecording = async () => {
    if (!hasPermission) return;
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
    });
    stream.start();
    await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
    audioRecorder.record();
  };

  const stopRecording = async () => {
    stream.stop();
    audioLevelRef.current = 0;
    await audioRecorder.stop();
    return audioRecorder.uri;
  };

  const duration = Math.floor((state.durationMillis ?? 0) / 1000);
  const formattedDuration = `${Math.floor(duration / 60)
    .toString()
    .padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}`;

  return {
    isRecording: state.isRecording,
    startRecording,
    stopRecording,
    formattedDuration,
    hasPermission,
    audioLevelRef, // expose ref directly
  };
}