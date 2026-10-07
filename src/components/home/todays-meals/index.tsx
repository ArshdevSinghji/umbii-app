import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { Flame, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import TodaysMealsSkeleton from "./loading";
import MealSheetContent from "./meal-sheet-content";
import MealSheetContentSkeleton from "./meal-sheet-content/loading";

export default function TodaysMeals() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isLoading,
    listFoodLogs,
    selectedFoodLog,
    isFoodLogLoading,
    fetchFoodLogById,
  } = useFoodLogsActionsHook();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogPress = (log: IFoodLog) => {
    setIsModalVisible(true);
    fetchFoodLogById(user.id, log.id);
  };

  const handleClose = () => setIsModalVisible(false);

  return (
    <View className="mt-8">
      <Text className="font-sans-bold text-lg mb-8">Today's meals</Text>

      {isLoading ? (
        <TodaysMealsSkeleton />
      ) : listFoodLogs.length === 0 ? (
        <Card className="py-6">
          <CardContent className="items-center">
            <Text className="font-sans-bold text-base">No meals logged</Text>
            <Text className="text-muted-foreground text-center text-sm">
              Start tracking your meals to see calories and nutrition
              breakdowns.
            </Text>
          </CardContent>
        </Card>
      ) : (
        <View className="gap-3">
          {listFoodLogs.map((log) => {
            const totalCalories = calculateNutrition(log.details).calories;

            return (
              <Pressable key={log.id} onPress={() => handleLogPress(log)}>
                <Card className="gap-2 py-4">
                  <CardHeader className="px-4">
                    <Text className="font-sans-bold" numberOfLines={1}>
                      {log.rawInputText}
                    </Text>
                  </CardHeader>
                  <CardContent className="flex-row justify-between items-center px-4">
                    <View className="flex-row gap-2">
                      <View
                        // Translucent flame orange: a soft tint on light and dark cards alike.
                        style={{ backgroundColor: "rgba(255, 90, 0, 0.12)" }}
                        className="p-1 rounded-full"
                      >
                        <Flame size={16} color="#FF5A00" fill="#FF5A00" />
                      </View>
                      <Text className="font-sans-bold">
                        {`${totalCalories.toFixed(0)} Kcal`}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-xs">
                      {log.details.length}{" "}
                      {log.details.length === 1 ? "item" : "items"}
                    </Text>
                  </CardContent>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        backdropColor={"rgba(0, 0, 0, 0.2)"}
      >
        <View className="flex-1">
          <Pressable
            className="flex-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onPress={handleClose}
          />

          <View className="h-[70%] bg-background rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-sans-bold text-base">Meal details</Text>
              <Pressable
                onPress={handleClose}
                hitSlop={8}
                className="p-1.5 rounded-full bg-muted"
              >
                <X size={16} color={theme.foreground} />
              </Pressable>
            </View>

            <View className="flex-1">
              {isFoodLogLoading || !selectedFoodLog ? (
                <MealSheetContentSkeleton />
              ) : (
                <MealSheetContent log={selectedFoodLog} />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
