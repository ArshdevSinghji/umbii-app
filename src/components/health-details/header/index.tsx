import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  title: string;
  description: string;
  onBack: () => void;
  disabled: boolean;
}

export default function HealthDetailsHeader({
  title,
  description,
  onBack,
  disabled,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="gap-6">
      <Pressable
        onPress={onBack}
        disabled={disabled}
        hitSlop={8}
        className="self-start p-2 rounded-full bg-muted"
      >
        <ArrowLeft size={18} color={theme.foreground} />
      </Pressable>

      <View className="gap-2">
        <Text className="font-sans-bold text-3xl">{title}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}
