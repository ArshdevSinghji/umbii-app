import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { getCurrentWeek } from "@/lib/utils";
import { View } from "react-native";

export default function WeekDays() {
  return (
    <View className="flex-row gap-1 mt-8">
      {getCurrentWeek().map((day) => (
        <Card
          key={day.week}
          className="shadow-none rounded-3xl items-center gap-2 py-2 border-muted bg-muted flex-1"
        >
          <Text className="text-xs font-sans-bold">{day.week}</Text>
          <View className={`${day.isToday ? "bg-primary" : "bg-card"} rounded-full w-8 h-8 justify-center items-center`}>
            <Text className={`${day.isToday && "text-primary-foreground"} font-sans-bold text-sm`}>
              {day.date}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}
