import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { getCurrentWeek } from "@/utils/get-current-week";
import { CircleCheck } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  date: string;
  handleDatePress: (date: string) => void;
}

export default function WeekDays({ date, handleDatePress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row gap-1 mt-8">
      {getCurrentWeek().map((day) => (
        <Pressable
          onPress={() => handleDatePress(day.fullDate)}
          key={day.date}
          className="flex-1"
        >
          <Card className="rounded-3xl items-center gap-2 py-2 bg-muted">
            <Text className="text-xs font-sans-bold">{day.week}</Text>
            <View
              className={cn(
                "rounded-full w-8 h-8 justify-center items-center relative",
                day.fullDate === date ? "bg-primary" : "bg-card",
              )}
            >
              <Text
                className={cn(
                  "font-sans-bold text-sm",
                  day.fullDate === date && "text-primary-foreground",
                )}
              >
                {day.date}
              </Text>

              <View className="absolute top-0 -right-0.5">
                <CircleCheck size={12} fill={theme.chart2} color={theme.primaryForeground}/>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
