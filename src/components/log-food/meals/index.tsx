import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { ErrorState } from "@/components/ui/error-state";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import MealsEmptyState from "./empty-state";
import MealsSkeleton from "./loading";
import MealCard from "./meal-card";

export default function Meals() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { recentFoodLogs, fetchRecentFoodLogs } = useFoodLogsActionsHook();

  // Skeleton only for the first load; saving a meal refreshes in place.
  const { isInitialLoad, hasError, isRetrying, retry } = useInitialLoad(
    () => fetchRecentFoodLogs(user.id),
    !!user.id,
  );

  const renderContent = () => {
    if (isInitialLoad) return <MealsSkeleton />;
    if (hasError) {
      return (
        <ErrorState
          title="Couldn't load your meals"
          onRetry={retry}
          isRetrying={isRetrying}
        />
      );
    }
    if (recentFoodLogs.length === 0) return <MealsEmptyState />;

    return (
      <View className="gap-3">
        {recentFoodLogs.map((log) => (
          <MealCard key={log.id} log={log} />
        ))}
      </View>
    );
  };

  return (
    <View className="gap-4">
      <Text className="font-sans-bold text-lg">Recent meals</Text>
      {renderContent()}
    </View>
  );
}
