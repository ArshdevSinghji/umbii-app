import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

// Same shell as the preference groups: a heading, then rows boxed to their
// real height (min-h-14 with the 32px icon chip).
export default function NotificationsSkeleton() {
  return (
    <View className="gap-6">
      {[3, 2, 4].map((rows, group) => (
        <View key={group} className="gap-2">
          <Skeleton className="ml-1 h-3 w-20 rounded-full" />
          <View className="overflow-hidden rounded-2xl bg-card">
            {Array.from({ length: rows }, (_, row) => (
              <View
                key={row}
                className="min-h-14 flex-row items-center gap-3 px-3 py-2"
              >
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-3.5 w-32 rounded-full" />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
