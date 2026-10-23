import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { CalendarBlank } from "phosphor-react-native/src/icons/CalendarBlank";
import { Pressable, View } from "react-native";
import { WEEK_DAYS } from "../notifications.utils";

interface IProps {
  // 1 (Monday) to 7 (Sunday).
  value: number;
  onChange: (value: number) => void;
}

// Weekly weigh-in day: a row of day letters under the label, since seven
// chips don't fit beside it on a phone.
export default function DayPicker({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const selected = WEEK_DAYS.find((day) => day.value === value);

  return (
    <View className="gap-2 px-3 py-3">
      <View className="flex-row items-center gap-3">
        <View className="size-8 items-center justify-center rounded-lg bg-muted">
          <CalendarBlank size={18} color={theme.foreground} />
        </View>
        <Text className="flex-1 text-sm">Day</Text>
        <Text className="text-sm text-muted-foreground">{selected?.label}</Text>
      </View>
      <View className="ml-11 flex-row justify-between">
        {WEEK_DAYS.map((day) => {
          const isSelected = day.value === value;
          return (
            <Pressable
              key={day.value}
              onPress={() => !isSelected && onChange(day.value)}
              className={cn(
                "size-9 items-center justify-center rounded-full active:opacity-70",
                isSelected ? "bg-primary" : "bg-muted",
              )}
              accessibilityRole="radio"
              accessibilityLabel={day.label}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                className={cn(
                  "text-xs",
                  isSelected
                    ? "font-sans-bold text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {day.short}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
