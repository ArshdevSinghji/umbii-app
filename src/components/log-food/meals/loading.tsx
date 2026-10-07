import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

// Same shell as MealCard. Rows are boxed to their real heights:
// title text-sm (20px), stats row = the 20px flame chip.
export default function MealsSkeleton() {
  return (
    <View className="gap-3">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="gap-2 px-4 py-3">
          <View className="h-5 flex-row items-center justify-between gap-3">
            <Skeleton className="h-3.5 w-44 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </View>
          <View className="h-5 flex-row items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-14 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </View>
        </Card>
      ))}
    </View>
  );
}
