import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { Calendar } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  onCalendarPress: () => void;
}

export default function BreakdownHeader({ onCalendarPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="font-sans-bold text-lg">Statistic</Text>
      <Pressable
        onPress={onCalendarPress}
        hitSlop={8}
        className="p-2 rounded-full bg-muted"
      >
        <Calendar size={18} color={theme.foreground} />
      </Pressable>
    </View>
  );
}
