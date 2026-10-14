import { reportRequestError } from "@/lib/http-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { BookmarkCheck, Flame } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, View } from "react-native";
import SaveRecipeForm from "@/components/save-recipe/save-recipe-form";
import { Button } from "@/components/ui/button";
import TodaysMealsSkeleton from "./loading";
import MealSheet from "@/components/meal-sheet";
import MealSheetContent from "@/components/meal-sheet/content";
import MealSheetContentSkeleton from "@/components/meal-sheet/content/loading";

export default function TodaysMeals() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isListLoading: isLoading,
    listFoodLogs,
    selectedFoodLog,
    isFoodLogLoading,
    fetchFoodLogById,
  } = useFoodLogsActionsHook();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);

  const handleLogPress = (log: IFoodLog) => {
    setIsRecipeFormOpen(false);
    setIsModalVisible(true);
    fetchFoodLogById(user.id, log.id).catch((error) =>
      reportRequestError("Error fetching meal:", error),
    );
  };

  // Can't be dismissed while a recipe is being saved.
  const handleClose = () => {
    if (!isSavingRecipe) setIsModalVisible(false);
  };

  const isLogReady = !isFoodLogLoading && !!selectedFoodLog;

  // Below the meal: "Save as recipe" (inline form, since a second modal on
  // top of this one is unreliable on iOS) or "Saved as recipe" once saved.
  const renderRecipeFooter = () => {
    if (!isLogReady || !selectedFoodLog) return null;

    if (selectedFoodLog.recipeId !== null) {
      return (
        <View className="flex-row items-center justify-center gap-2 pt-4">
          <BookmarkCheck size={16} color={theme.chart2} fill={theme.chart2} />
          <Text className="text-sm text-muted-foreground">Saved as recipe</Text>
        </View>
      );
    }

    if (isRecipeFormOpen) {
      return (
        <View className="pt-4">
          <SaveRecipeForm
            log={selectedFoodLog}
            onDone={() => setIsRecipeFormOpen(false)}
            onCancel={() => setIsRecipeFormOpen(false)}
            onSavingChange={setIsSavingRecipe}
          />
        </View>
      );
    }

    return (
      <View className="pt-4">
        <Button
          variant="outline"
          className="h-12 rounded-full"
          onPress={() => setIsRecipeFormOpen(true)}
        >
          <Text>Save as recipe</Text>
        </Button>
      </View>
    );
  };

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
              <Pressable
                key={log.id}
                onPress={() => handleLogPress(log)}
                className="active:opacity-70"
              >
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

      <MealSheet
        visible={isModalVisible}
        title="Meal details"
        onClose={handleClose}
        footer={renderRecipeFooter()}
      >
        {isFoodLogLoading || !selectedFoodLog ? (
          <MealSheetContentSkeleton />
        ) : (
          <MealSheetContent log={selectedFoodLog} />
        )}
      </MealSheet>
    </View>
  );
}
