import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function NutrientsListSkeleton() {
  return (
    <Card className="gap-2 py-4 px-4">
      {[1, 2, 3, 4].map((item) => (
        <View key={item} className="flex-row justify-between items-center py-2">
          <View className="flex-row gap-2 items-center">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </View>
          <View className="flex-row items-center gap-2">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </View>
        </View>
      ))}
    </Card>
  );
}
