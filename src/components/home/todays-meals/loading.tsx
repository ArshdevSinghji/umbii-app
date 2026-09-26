import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export default function TodaysMealsSkeleton() {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <Skeleton className="h-5 w-24 rounded-full" />
      </CardHeader>

      <CardContent className="flex-row justify-between items-center px-4">
        <View className="flex-row gap-2 items-center">
          {/* Flame Icon Container */}
          <Skeleton className="h-6 w-6 rounded-full" />

          {/* Calories */}
          <Skeleton className="h-5 w-20 rounded-full" />
        </View>

        {/* Entries Count */}
        <Skeleton className="h-4 w-14 rounded-full" />
      </CardContent>
    </Card>
  );
}
