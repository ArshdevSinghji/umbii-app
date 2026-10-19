import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { ReactNode, useCallback } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Charcoal in light mode; the card colour in dark mode, so it still stands
// apart from the near-black page.
const LIGHT_BAND = "#18181B";

interface IProps {
  title: string;
  onBack?: () => void;
  // Under the title row, e.g. the avatar and name.
  children?: ReactNode;
}

// The dark band at the top of Profile and Settings, running up under the
// status bar. The content sheet below overlaps its rounded bottom.
export default function PageHeader({ title, onBack, children }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  // Light status-bar icons over the band while this screen is in front;
  // back to the theme's when it isn't.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle(colorScheme === "dark" ? "light" : "dark");
    }, [colorScheme]),
  );

  return (
    <View
      className="gap-5 px-4 pb-12"
      style={{
        paddingTop: insets.top + 12,
        backgroundColor: colorScheme === "dark" ? theme.card : LIGHT_BAND,
      }}
    >
      <View className="h-10 flex-row items-center">
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            className="size-10 items-center justify-center rounded-full bg-white/10 active:opacity-60"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <CaretLeft size={18} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View className="size-10" />
        )}
        <Text className="flex-1 text-center font-sans-bold text-lg text-white">
          {title}
        </Text>
        <View className="size-10" />
      </View>
      {children}
    </View>
  );
}
