import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function MealSheetContentSkeleton() {
  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </View>

      <Separator className="bg-accent-foreground/30" />

      {[1, 2].map((item) => (
        <View key={item} className="gap-2 pb-2">
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </View>
            <Skeleton className="h-4 w-14 rounded-full" />
          </View>

          {[1, 2, 3, 4, 5].map((row) => (
            <View
              key={row}
              className="flex-row justify-between items-center mt-2"
            >
              <View className="flex-row gap-1 items-center">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-14 rounded-full" />
              </View>
              <Skeleton className="h-4 w-10 rounded-full" />
            </View>
          ))}

          {item === 1 && <Separator className="bg-accent-foreground/30" />}
        </View>
      ))}
    </View>
  );
}
