import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

// Same shell as RecipeCard: name (text-sm, 20px) and the macros row (20px).
export default function RecipesSkeleton() {
  return (
    <View className="gap-3">
      {[1, 2].map((item) => (
        <Card key={item} className="gap-2 px-4 py-3">
          <View className="h-5 justify-center">
            <Skeleton className="h-3.5 w-40 rounded-full" />
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
