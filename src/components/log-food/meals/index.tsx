import MealSheet from "@/components/meal-sheet";
import ChildSheet from "@/components/meal-sheet/child-sheet";
import MealSheetContent from "@/components/meal-sheet/content";
import SaveRecipeForm from "@/components/save-recipe/save-recipe-form";
import { ActionButton } from "@/components/ui/action-button";
import { ErrorState } from "@/components/ui/error-state";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useAppSelector } from "@/store/hooks";
import { BookmarkSimple } from "phosphor-react-native/src/icons/BookmarkSimple";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import MealsEmptyState from "./empty-state";
import MealsSkeleton from "./loading";
import MealCard from "./meal-card";

export default function Meals() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

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
  // Bumped per opening so the save form remounts fresh (name, errors).
  const [saveCount, setSaveCount] = useState(0);

  // Live copy from the list, so recipeId updates as soon as it's saved.
  const sheetLog =
    recentFoodLogs.find((log) => log.id === openedLog?.id) ?? openedLog;

  const openMeal = (log: IFoodLog) => {
    // Don't open the sheet over the food input's keyboard.
    KeyboardController.dismiss();
    setIsSaveOpen(false);
    setOpenedLog(log);
    setIsSheetOpen(true);
  };

  const openSave = () => {
    setSaveCount((count) => count + 1);
    setIsSaveOpen(true);
  };

  // Back / backdrop: close the save child sheet first, then the meal sheet.
  // Nothing closes while saving.
  const closeMeal = () => {
    if (isSaving) return;
    if (isSaveOpen) setIsSaveOpen(false);
    else setIsSheetOpen(false);
  };

  // "Save as recipe" only while it isn't one yet; otherwise just a note.
  const renderFooter = () => {
    if (!sheetLog) return null;

    if (sheetLog.recipeId !== null) {
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
        footer={renderFooter()}
        overlay={
          sheetLog && (
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
          )
        }
      >
        {sheetLog && <MealSheetContent log={sheetLog} />}
      </MealSheet>
    </View>
  );
}
