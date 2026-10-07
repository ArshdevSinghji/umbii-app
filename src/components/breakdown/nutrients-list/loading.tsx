import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { View } from "react-native";
import { HEALTH_SCORE_RING_SIZE } from "./health-score";

export default function NutrientsListSkeleton() {
  return (
    <Card className="gap-2 py-4 px-4">
      {/* Mirrors HealthScore: label + rating on the left, ring on the right. */}
      <View className="flex-row items-center justify-between">
        <View className="gap-1.5">
          <Skeleton className="h-3.5 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </View>
        <Skeleton
          className="rounded-full"
          style={{
            width: HEALTH_SCORE_RING_SIZE,
            height: HEALTH_SCORE_RING_SIZE,
          }}
        />
      </View>
      <Separator className="my-1" />
      {[1, 2, 3, 4].map((item) => (
        <View key={item} className="flex-row justify-between items-center py-2">
          <View className="flex-row gap-2 items-center">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </View>
          <View className="flex-row items-center gap-2">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </View>
        </View>
      ))}
    </Card>
  );
}
