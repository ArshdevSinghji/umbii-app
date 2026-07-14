import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function TodaysGoalSkeleton() {
  return (
    <Card className="mt-8 shadow-none px-4 gap-3">
      <View className="flex-row justify-between items-center">
        <View className="gap-2">
          <Skeleton className="h-4 w-24 rounded-full" />

          {/* 460 / 1600 */}
          <View className="flex-row items-end gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </View>
        </View>

        {/* Circular Progress */}
        <View className="items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </View>
      </View>

      <Separator />

      {/* Goal Progress Cards */}
      <View className="flex-row justify-between px-4">
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="items-center gap-2"
          >
            {/* Icon */}
            <Skeleton className="h-7 w-7 rounded-full" />

            {/* Percentage / Left */}
            <Skeleton className="h-5 w-10 rounded-md" />

            {/* Label */}
            <Skeleton className="h-3 w-16 rounded-full" />

            {/* Progress bar */}
            <Skeleton className="h-2 w-14 rounded-full" />
          </View>
        ))}
      </View>
    </Card>
  );
}