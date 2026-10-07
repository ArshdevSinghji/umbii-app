import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MealsEmptyState from "./empty-state";
import MealsSkeleton from "./loading";
import MealCard from "./meal-card";

export default function Meals() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { recentFoodLogs, fetchRecentFoodLogs } = useFoodLogsActionsHook();

  // Skeleton only for the first load; saving a meal refreshes in place.
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    fetchRecentFoodLogs(user.id)
      .catch((error) => console.error("Error fetching recent meals:", error))
      .finally(() => setIsInitialLoad(false));
  }, [user.id]);

  const renderContent = () => {
    if (isInitialLoad) return <MealsSkeleton />;
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
