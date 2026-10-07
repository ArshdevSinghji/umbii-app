import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

// Mirrors WeightChart: real title, a placeholder boxed to the text-2xl
// line (32px) for the percentage, and the chart's fixed 180px height.
export default function WeightChartSkeleton() {
  return (
    <Card className="gap-4 px-4 py-4">
      <View className="gap-0.5">
        <Text className="font-sans-bold text-lg">Weight Progress</Text>
        <View className="h-8 justify-center">
          <Skeleton className="h-7 w-28 rounded-md" />
        </View>
      </View>
      <Skeleton className="h-[180px] w-full rounded-xl" />
    </Card>
  );
}
