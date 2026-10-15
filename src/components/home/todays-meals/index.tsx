import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import { BookmarkSimple } from "phosphor-react-native/src/icons/BookmarkSimple";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, View } from "react-native";
import SaveRecipeForm from "@/components/save-recipe/save-recipe-form";
import { ActionButton } from "@/components/ui/action-button";
import ChildSheet from "@/components/meal-sheet/child-sheet";
import TodaysMealsSkeleton from "./loading";
import MealSheet from "@/components/meal-sheet";
import MealSheetContent from "@/components/meal-sheet/content";

export default function TodaysMeals() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { isListLoading: isLoading, listFoodLogs } = useFoodLogsActionsHook();

  // The day's list already has each meal's items, so the sheet opens straight
  // from it — no extra request. Kept after closing so the sheet can slide out
  // with its content.
  const [openedLog, setOpenedLog] = useState<IFoodLog | null>(null);
  // Live copy from the list, so recipeId updates as soon as it's saved.
  const selectedFoodLog =
    listFoodLogs.find((log) => log.id === openedLog?.id) ?? openedLog;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);
  // Bumped per opening so the save form remounts fresh (name, errors).
  const [saveCount, setSaveCount] = useState(0);

  const handleLogPress = (log: IFoodLog) => {
    setIsSaveOpen(false);
    setOpenedLog(log);
    setIsModalVisible(true);
  };

  const openSave = () => {
    setSaveCount((count) => count + 1);
    setIsSaveOpen(true);
  };

  // Back / backdrop: close the save child sheet first, then the meal sheet.
  // Nothing closes while a recipe is being saved. (Same as Log Food.)
  const handleClose = () => {
    if (isSavingRecipe) return;
    if (isSaveOpen) setIsSaveOpen(false);
    else setIsModalVisible(false);
  };

  // Below the meal: "Save as recipe" (opens a child sheet in the same Modal)
  // or "In your recipes" once it's linked to one (saved as, or eaten from).
  const renderRecipeFooter = () => {
    if (!selectedFoodLog) return null;

    if (selectedFoodLog.recipeId !== null) {
      return (
        <View className="flex-row items-center justify-center gap-2 pt-4">
          <BookmarkSimple size={16} color={theme.chart2} weight="fill" />
          <Text className="text-sm text-muted-foreground">In your recipes</Text>
        </View>
      );
    }

    return (
      <View className="pt-4">
        <ActionButton label="Save as recipe" onPress={openSave} />
      </View>
    );
  };

  return (
    <View className="mt-8">
      <Text className="font-sans-bold text-lg mb-8">{`Today's meals`}</Text>

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
                        <Fire size={16} color="#FF5A00" weight="fill" />
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
        overlay={
          selectedFoodLog && (
            <ChildSheet
              visible={isSaveOpen}
              title="Save as recipe"
              description="Name it so you can find and log this meal again."
              onClose={handleClose}
            >
              <SaveRecipeForm
                key={`${selectedFoodLog.id}-${saveCount}`}
                log={selectedFoodLog}
                onDone={() => setIsSaveOpen(false)}
                onCancel={() => setIsSaveOpen(false)}
                onSavingChange={setIsSavingRecipe}
              />
            </ChildSheet>
          )
        }
      >
        {selectedFoodLog && <MealSheetContent log={selectedFoodLog} />}
      </MealSheet>
    </View>
  );
}
