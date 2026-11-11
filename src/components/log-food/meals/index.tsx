import MealSheet from "@/components/meal-sheet";
import ChildSheet from "@/components/meal-sheet/child-sheet";
import DeleteMealSheet from "@/components/meal-sheet/delete-meal-sheet";
import MealFooter from "@/components/meal-sheet/meal-footer";
import MealSheetContent from "@/components/meal-sheet/content";
import SaveRecipeForm from "@/components/save-recipe/save-recipe-form";
import { ErrorState } from "@/components/ui/error-state";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
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

  useRefresh(() => fetchRecentFoodLogs(user.id));

  // Kept after closing so the sheet can slide out with its content.
  const [openedLog, setOpenedLog] = useState<IFoodLog | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Bumped per opening so the save form remounts fresh (name, errors).
  const [saveCount, setSaveCount] = useState(0);

  // Live copy from the list, so recipeId updates as soon as it's saved.
  const sheetLog =
    recentFoodLogs.find((log) => log.id === openedLog?.id) ?? openedLog;

  const openMeal = (log: IFoodLog) => {
    // Don't open the sheet over the food input's keyboard.
    KeyboardController.dismiss();
    setIsSaveOpen(false);
    setIsDeleteOpen(false);
    setOpenedLog(log);
    setIsSheetOpen(true);
  };

  const openSave = () => {
    setSaveCount((count) => count + 1);
    setIsSaveOpen(true);
  };

  // Back / backdrop: close a child sheet first, then the meal sheet.
  // Nothing closes while saving or deleting.
  const closeMeal = () => {
    if (isSaving || isDeleting) return;
    if (isSaveOpen) setIsSaveOpen(false);
    else if (isDeleteOpen) setIsDeleteOpen(false);
    else setIsSheetOpen(false);
  };

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
          <MealCard key={log.id} log={log} onPress={openMeal} />
        ))}
      </View>
    );
  };

  return (
    <View className="gap-4">
      <Text className="font-sans-bold text-lg">Recent meals</Text>
      {renderContent()}

      {/* Same sheet as Home's meals and recipes; the log already has its
          items, so no extra request. */}
      <MealSheet
        visible={isSheetOpen}
        title="Meal details"
        onClose={closeMeal}
        footer={
          sheetLog && (
            <MealFooter
              log={sheetLog}
              onSave={openSave}
              onDelete={() => setIsDeleteOpen(true)}
            />
          )
        }
        overlay={
          sheetLog && (
            <>
              <ChildSheet
                visible={isSaveOpen}
                title="Save as recipe"
                description="Name it so you can find and log this meal again."
                onClose={closeMeal}
              >
                <SaveRecipeForm
                  key={`${sheetLog.id}-${saveCount}`}
                  log={sheetLog}
                  onDone={() => setIsSaveOpen(false)}
                  onCancel={() => setIsSaveOpen(false)}
                  onSavingChange={setIsSaving}
                />
              </ChildSheet>
              <DeleteMealSheet
                visible={isDeleteOpen}
                log={sheetLog}
                onClose={() => setIsDeleteOpen(false)}
                onDeleted={() => {
                  setIsDeleteOpen(false);
                  setIsSheetOpen(false);
                }}
                onBusyChange={setIsDeleting}
              />
            </>
          )
        }
      >
        {sheetLog && <MealSheetContent log={sheetLog} />}
      </MealSheet>
    </View>
  );
}
