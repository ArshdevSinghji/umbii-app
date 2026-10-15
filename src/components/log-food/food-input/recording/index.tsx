import { THEME } from "@/lib/theme";
import { PaperPlaneRight } from "phosphor-react-native/src/icons/PaperPlaneRight";
import { X } from "phosphor-react-native/src/icons/X";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import Waveform from "../waveform";

interface IProps {
  audioLevelRef: React.MutableRefObject<number>;
  onCancel: () => void;
  onSend: () => void;
}

export default function RecordingUI({
  audioLevelRef,
  onCancel,
  onSend,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="bg-card border border-border rounded-3xl flex-row items-center px-3 py-3 gap-3">
      <Pressable
        onPress={onCancel}
        className="h-9 w-9 items-center justify-center rounded-full bg-muted"
      >
        <X size={18} color={theme.foreground} />
      </Pressable>

      <Waveform audioLevelRef={audioLevelRef} isRecording={true} />

      <Pressable
        onPress={onSend}
        className="h-9 w-9 items-center justify-center rounded-full bg-primary"
      >
        <PaperPlaneRight size={16} color={theme.primaryForeground} />
      </Pressable>
    </View>
  );
}
