import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

// Days without data look like any other day; they just can't be pressed.
interface IProps {
  day: number;
  isSelected: boolean;
  isDisabled: boolean;
  isCompleted: boolean;
  isNotCompleted: boolean;
  onPress: () => void;
}

export default function AdherenceDay({
  day,
  isSelected,
  isDisabled,
  isCompleted,
  isNotCompleted,
  onPress,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className="w-9 h-9 items-center justify-center"
    >
      <View
        className={cn(
          "w-8 h-8 rounded-full items-center justify-center relative",
          isSelected && "bg-primary",
          !isSelected &&
            isNotCompleted &&
            "border border-dashed border-muted-foreground",
        )}
      >
        <Text
          className={cn(
            "text-xs font-sans-bold",
            isSelected && "text-primary-foreground",
          )}
        >
          {day}
        </Text>

        {isCompleted && (
          <View className="absolute top-0 -right-0.5">
            <CircleCheck
              size={10}
              fill={theme.chart2}
              color={theme.primaryForeground}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}
