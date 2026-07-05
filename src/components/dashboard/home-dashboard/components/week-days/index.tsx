import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { getCurrentWeek } from "@/lib/utils";
import { View } from "react-native";

export default function WeekDays() {
  return (
    <View className="flex-row gap-1 mt-8 justify-between">
      {getCurrentWeek().map((day) => (
        <Card
          key={day.week}
          className="shadow-none rounded-3xl items-center gap-2 pt-2 pb-1 px-1.5 bg-muted border-muted"
        >
          <Text className="text-xs font-sans-bold">{day.week}</Text>
          <View className={`${ day.isToday ? "bg-primary" : "bg-card" } rounded-full w-8 h-8 justify-center items-center`}>
            <Text className={`${day.isToday && "text-primary-foreground"} font-sans-bold`}>
              {day.date}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}
