import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function WeightCardSkeleton() {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-4 py-4 border-0 rounded-2xl">
      <View className="gap-1.5">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-full" />
      </View>
      <Skeleton className="h-10 w-32 rounded-full" />
    </Card>
  );
}
