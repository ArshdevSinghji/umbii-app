import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { useState } from "react";
import { Pressable, View } from "react-native";
import SaveRecipeForm from "@/components/save-recipe/save-recipe-form";
import ChildSheet from "@/components/meal-sheet/child-sheet";
import TodaysMealsSkeleton from "./loading";
import MealAvatars from "./meal-avatars";
import MealSheet from "@/components/meal-sheet";
import MealSheetContent from "@/components/meal-sheet/content";
import DeleteMealSheet from "@/components/meal-sheet/delete-meal-sheet";
import MealFooter from "@/components/meal-sheet/meal-footer";

export default function TodaysMeals() {
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Bumped per opening so the save form remounts fresh (name, errors).
  const [saveCount, setSaveCount] = useState(0);

  const handleLogPress = (log: IFoodLog) => {
    setIsSaveOpen(false);
    setIsDeleteOpen(false);
    setOpenedLog(log);
    setIsModalVisible(true);
  };

  const openSave = () => {
    setSaveCount((count) => count + 1);
    setIsSaveOpen(true);
  };

  // Back / backdrop: close a child sheet first, then the meal sheet.
  // Nothing closes while saving or deleting. (Same as Log Food.)
  const handleClose = () => {
    if (isSavingRecipe || isDeleting) return;
    if (isSaveOpen) setIsSaveOpen(false);
    else if (isDeleteOpen) setIsDeleteOpen(false);
    else setIsModalVisible(false);
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
                {/* Name and calories on the left, the meal's photos at
                    the bottom right, level with the calories. */}
                <Card className="flex-row items-end justify-between gap-4 px-4 py-4">
                  <View className="flex-1 gap-2">
                    <Text className="font-sans-bold" numberOfLines={1}>
                      {log.rawInputText}
                    </Text>
                    <View className="flex-row items-center gap-2">
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
                  </View>
                  <MealAvatars itemCount={log.details.length} seed={log.id} />
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
        footer={
          selectedFoodLog && (
            <MealFooter
              log={selectedFoodLog}
              onSave={openSave}
              onDelete={() => setIsDeleteOpen(true)}
            />
          )
        }
        overlay={
          selectedFoodLog && (
            <>
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
              <DeleteMealSheet
                visible={isDeleteOpen}
                log={selectedFoodLog}
                onClose={() => setIsDeleteOpen(false)}
                onDeleted={() => {
                  setIsDeleteOpen(false);
                  setIsModalVisible(false);
                }}
                onBusyChange={setIsDeleting}
              />
            </>
          )
        }
      >
        {selectedFoodLog && <MealSheetContent log={selectedFoodLog} />}
      </MealSheet>
    </View>
  );
}
