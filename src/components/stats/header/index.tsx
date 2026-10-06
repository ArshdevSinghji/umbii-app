import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { EllipsisVertical } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  onMenuPress: () => void;
}

export default function StatsHeader({ onMenuPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="font-sans-bold text-lg">Goal Progress</Text>
      <Pressable
        onPress={onMenuPress}
        hitSlop={8}
        className="p-2 rounded-full bg-muted"
      >
        <EllipsisVertical size={18} color={theme.foreground} />
      </Pressable>
    </View>
  );
}
