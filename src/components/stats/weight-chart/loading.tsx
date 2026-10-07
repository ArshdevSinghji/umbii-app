import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function WeightChartSkeleton() {
  return (
    <Card className="gap-4 px-4 py-4">
      <View className="gap-1.5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </View>
      <Skeleton className="h-[180px] w-full rounded-xl" />
    </Card>
  );
}
