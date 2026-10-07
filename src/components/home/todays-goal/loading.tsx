import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";
import GoalProgress from "./goal-progress";

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

      {/* Same tiles as the loaded state, so nothing moves when data lands. */}
      <View className="flex-row gap-2">
        {["Protein", "Carbs", "Fat"].map((name) => (
          <GoalProgress
            key={name}
            isLoading
            name={name}
            value={0}
            color="transparent"
            icon={null}
          />
        ))}
      </View>
    </Card>
  );
}