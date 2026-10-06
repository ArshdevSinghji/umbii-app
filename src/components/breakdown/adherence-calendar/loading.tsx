import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function AdherenceCalendarSkeleton() {
  return (
    <View className="gap-3 py-4 px-4">
      <Skeleton className="h-4 w-28 rounded-full" />

      <View className="flex-row justify-between">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Skeleton key={item} className="h-3 w-4 rounded-full" />
        ))}
      </View>

      {[1, 2, 3, 4, 5, 6].map((week) => (
        <View key={week} className="flex-row justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <Skeleton key={day} className="h-8 w-8 rounded-full" />
          ))}
        </View>
      ))}
    </View>
  );
}
