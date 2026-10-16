import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

// Mirrors a meal card: name and calories on the left, the overlapping
// photo stack (36px circles, 12px overlap) and "+" at the bottom right.
export default function TodaysMealsSkeleton() {
  return (
    <Card className="flex-row items-end justify-between gap-4 px-4 py-4">
      <View className="flex-1 gap-2">
        <Skeleton className="h-5 w-32 rounded-full" />
        <View className="flex-row items-center gap-2">
          {/* Flame chip */}
          <Skeleton className="h-6 w-6 rounded-full" />
          {/* Calories */}
          <Skeleton className="h-5 w-20 rounded-full" />
        </View>
      </View>
      <View className="flex-row">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            className={`size-9 rounded-full border-2 border-card ${
              item < 4 ? "-mr-3" : ""
            }`}
          />
        ))}
      </View>
    </Card>
  );
}
