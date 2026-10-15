import { SheetHandle } from "@/components/ui/sheet-handle";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { X } from "phosphor-react-native/src/icons/X";
import { useColorScheme } from "nativewind";
import { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";

interface IProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  // Usually MealSheetContent (or its skeleton); fills the space.
  children: ReactNode;
  // Pinned under the content, e.g. "Save as recipe".
  footer?: ReactNode;
  // Layers drawn above the sheet inside the same Modal (e.g. a ChildSheet).
  overlay?: ReactNode;
}

// Bottom sheet for a meal's details: title, close button, content, footer.
// Shared by Home's meals and recipes.
export default function MealSheet({
  visible,
  title,
  onClose,
  children,
  footer,
  overlay,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      // Modals are their own native window on Android: draw behind the
      // system bars so keyboard insets line up (edge-to-edge).
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* Dim the whole modal, so the sheet's rounded corners show against the
          overlay instead of the page behind. */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />

        {/* 70% tall, but allowed to shrink when the keyboard needs room. */}
        <View
          className="h-[70%] shrink rounded-t-3xl bg-background p-6"
          style={{ paddingBottom: 24 + insets.bottom }}
        >
          <SheetHandle />
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-sans-bold text-base">{title}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              className="rounded-full bg-muted p-1.5"
            >
              <X size={16} color={theme.foreground} />
            </Pressable>
          </View>

          <View className="flex-1">{children}</View>
          {footer}
        </View>
      </KeyboardAvoidingView>
      {overlay}
    </Modal>
  );
}
