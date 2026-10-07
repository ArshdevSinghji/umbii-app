import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

// Same outer (w-9 h-9) and inner (w-8 h-8) boxes as AdherenceDay, so swapping
// one for the other never moves anything.
export default function AdherenceDaySkeleton() {
  return (
    <View className="w-9 h-9 items-center justify-center">
      <Skeleton className="w-8 h-8 rounded-full" />
    </View>
  );
}
