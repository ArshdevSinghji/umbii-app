import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { CloudSlash } from "phosphor-react-native/src/icons/CloudSlash";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

interface IProps {
  title: string;
  description?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

// Shown in place of a section when its first load fails, so a failed request
// never looks like "no data" (and never offers an empty state's actions).
export function ErrorState({
  title,
  description = "Check your connection and try again.",
  onRetry,
  isRetrying = false,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Card className="items-center gap-4 px-6 py-8">
      <View className="rounded-full bg-muted p-4">
        <CloudSlash size={28} color={theme.mutedForeground} />
      </View>
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg text-center">{title}</Text>
        <Text className="text-center text-sm text-muted-foreground">
          {description}
        </Text>
      </View>
      <Button className="rounded-full" onPress={onRetry} disabled={isRetrying}>
        <Loading isLoading={isRetrying} text="Try again" />
      </Button>
    </Card>
  );
}
