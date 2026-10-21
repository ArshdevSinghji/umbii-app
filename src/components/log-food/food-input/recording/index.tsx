import { THEME } from "@/lib/theme";
import { ArrowUp } from "phosphor-react-native/src/icons/ArrowUp";
import { Stop } from "phosphor-react-native/src/icons/Stop";
import { X } from "phosphor-react-native/src/icons/X";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, Pressable, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Waveform from "../waveform";

interface IProps {
  level: SharedValue<number>;
  // Waiting for the last words after stop / send.
  isFinishing: boolean;
  onCancel: () => void;
  // Stop and put the words in the input to edit.
  onStop: () => void;
  // Stop and log the words straight away.
  onSend: () => void;
}

// Replaces the input row while dictating: cancel, live waveform, stop, send.
export default function RecordingBar({
  level,
  isFinishing,
  onCancel,
  onStop,
  onSend,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="min-h-10 flex-1 flex-row items-center gap-2">
      <Pressable
        onPress={onCancel}
        hitSlop={6}
        accessibilityLabel="Cancel recording"
        className="h-9 w-9 items-center justify-center rounded-full border border-border"
      >
        <X size={16} color={theme.foreground} />
      </Pressable>

      <View className="mx-1 flex-1">
        <Waveform level={level} />
      </View>

      <Pressable
        onPress={onStop}
        disabled={isFinishing}
        hitSlop={6}
        accessibilityLabel="Stop recording"
        className="h-9 w-9 items-center justify-center rounded-full border border-border"
      >
        <Stop size={14} weight="fill" color={theme.foreground} />
      </Pressable>

      <Pressable
        onPress={onSend}
        disabled={isFinishing}
        hitSlop={6}
        accessibilityLabel="Log what you said"
        className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
      >
        {isFinishing ? (
          <ActivityIndicator color="white" />
        ) : (
          <ArrowUp size={18} color="white" />
        )}
      </Pressable>
    </View>
  );
}
