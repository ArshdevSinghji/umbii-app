import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function CalorieSummarySkeleton() {
  return (
    <Card className="items-center gap-4 py-6 px-4">
      <View className="w-full items-start gap-1.5">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-3 w-28 rounded-full mt-1" />
      </View>

      <Skeleton className="h-[140px] w-[140px] rounded-full" />

      <View className="flex-row gap-3 w-full">
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-1 items-center rounded-2xl py-3 gap-1">
            <Skeleton className="h-5 w-10 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </View>
        ))}
      </View>
    </Card>
  );
}
