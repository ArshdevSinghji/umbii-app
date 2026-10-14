import { SheetHandle } from "@/components/ui/sheet-handle";
import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IProps {
  visible: boolean;
  title: string;
  description?: string;
  // Tap on the backdrop. Ignore it while something is saving.
  onClose: () => void;
  children: ReactNode;
}

// A sheet on top of a sheet, drawn as a layer inside the parent's Modal (a
// second Modal on top of one is unreliable on iOS). Its own dark backdrop
// covers the parent sheet so the two read as separate layers.
export default function ChildSheet({
  visible,
  title,
  description,
  onClose,
  children,
}: IProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={StyleSheet.absoluteFill}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
        />
        {/* Spacer that lets taps through to the backdrop. */}
        <View style={styles.fill} pointerEvents="none" />
        <Animated.View
          entering={SlideInDown.duration(220)}
          className="gap-4 rounded-t-3xl bg-background p-6"
          style={{ paddingBottom: 24 + insets.bottom }}
        >
          <SheetHandle />
          <View className="gap-1">
            <Text className="font-sans-bold text-lg">{title}</Text>
            {description && (
              <Text className="text-sm text-muted-foreground">
                {description}
              </Text>
            )}
          </View>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
});
