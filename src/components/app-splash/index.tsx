import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";

interface IProps {
  // A line under the spinner, e.g. "Building your plan".
  caption?: string;
}

// Full-screen loading screen, shown only while the account loads after
// sign-in. A plain spinner for now; the egg animation can come back later.
// Covers whatever is behind it.
export default function AppSplash({ caption }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View
      className="absolute inset-0 items-center justify-center gap-4 bg-background"
      accessibilityRole="progressbar"
      accessibilityLabel={caption ?? "Loading"}
    >
      <ActivityIndicator size="large" color={theme.foreground} />
      {caption && (
        <Text className="text-sm text-muted-foreground">{caption}</Text>
      )}
    </View>
  );
}
