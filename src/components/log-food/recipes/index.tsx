import RecipeSearch from "./recipe-search";
import { KeyboardController } from "react-native-keyboard-controller";
import { eventBus } from "@/lib/event-bus";
import DeleteRecipeSheet from "./delete-recipe-sheet";
import RenameRecipeSheet from "./rename-recipe-sheet";
import RecipeSheetFooter from "./recipe-sheet-footer";
import { useLogRecipe } from "./hooks/use-log-recipe";
import MealSheet from "@/components/meal-sheet";
import MealSheetContent from "@/components/meal-sheet/content";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { ErrorState } from "@/components/ui/error-state";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useAppSelector } from "@/store/hooks";
import { Pressable, View } from "react-native";
import RecipesEmptyState from "./empty-state";
import RecipesSkeleton from "./loading";
import RecipeCard from "./recipe-card";

export default function Recipes() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { listRecipes, fetchRecipes } = useRecipesActionsHook();

  // Skeleton only for the first load, same as the stats screen.
  const { isInitialLoad, hasError, isRetrying, retry } = useInitialLoad(
    () => fetchRecipes(user.id),
    !!user.id,
  );

  useRefresh(() => fetchRecipes(user.id));

  // Kept after closing so the sheet can slide out with its content.
  const [openedRecipe, setOpenedRecipe] = useState<IRecipe | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { logRecipe, isLogging } = useLogRecipe();

  // The live copy from the list (so a rename shows straight away), falling
  // back to the opened one while the sheet slides out after a delete.
  const sheetRecipe =
    listRecipes.find((recipe) => recipe.id === openedRecipe?.id) ??
    openedRecipe;

  // Which child sheet (rename / delete) is open over the recipe sheet.
  const [childSheet, setChildSheet] = useState<"rename" | "delete" | null>(
    null,
  );
  const [isChildBusy, setIsChildBusy] = useState(false);
  // Bumped per opening so a child sheet remounts fresh (name, errors).
  const [childCount, setChildCount] = useState(0);

  const openRecipe = (recipe: IRecipe) => {
    // Don't open the sheet over the food input's keyboard.
    KeyboardController.dismiss();
    setChildSheet(null);
    setOpenedRecipe(recipe);
    setIsSheetOpen(true);
  };

  const openChildSheet = (sheet: "rename" | "delete") => {
    setChildCount((count) => count + 1);
    setChildSheet(sheet);
  };

  const closeChildSheet = () => setChildSheet(null);

  // Closes the recipe sheet and anything on top of it.
  const closeAll = () => {
    setChildSheet(null);
    setIsSheetOpen(false);
  };

  // Back / backdrop: close a child sheet first, then the recipe sheet.
  // Nothing closes while a request (log / rename / delete) is in flight.
  const closeRecipe = () => {
    if (isLogging || isChildBusy) return;
    if (childSheet) closeChildSheet();
    else setIsSheetOpen(false);
  };

  const handleLogRecipe = async () => {
    if (!sheetRecipe) return;
    if (await logRecipe(sheetRecipe)) setIsSheetOpen(false);
  };

  // The empty state's real height once it has rendered; until then (e.g. a
  // user who already has recipes) its computed height: py-8 (64) + image
  // (144) + gaps (32) + title (28) + gap (4) + 2-line text (40) + button (40).
  const [minHeight, setMinHeight] = useState(352);

  // Client-side search over what's already loaded: recipe names and the
  // foods inside each recipe, ignoring case and extra spaces.
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRecipes = normalizedQuery
    ? listRecipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(normalizedQuery) ||
          (recipe.details ?? []).some((item) =>
            item.name.toLowerCase().includes(normalizedQuery),
          ),
      )
    : listRecipes;

  const renderContent = () => {
    if (isInitialLoad) return <RecipesSkeleton />;
    if (hasError) {
      return (
        <ErrorState
          title="Couldn't load your recipes"
          onRetry={retry}
          isRetrying={isRetrying}
        />
      );
    }

    if (listRecipes.length === 0) {
      return (
        <RecipesEmptyState
          onAddRecipe={() => eventBus.emit("food-input:focus")}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (Math.round(height) !== Math.round(minHeight))
              setMinHeight(height);
          }}
        />
      );
    }

    return (
      <View className="gap-3">
        <RecipeSearch value={query} onChange={setQuery} />
        {visibleRecipes.length === 0 && (
          <View className="items-center gap-1 py-6">
            <Text className="text-sm text-muted-foreground">
              {`No recipes match "${query.trim()}"`}
            </Text>
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Text className="text-sm font-sans-bold">Clear search</Text>
            </Pressable>
          </View>
        )}
        {visibleRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onPress={openRecipe} />
        ))}
      </View>
    );
  };

  return (
    <View className="gap-4">
      <Text className="font-sans-bold text-lg">Your recipes</Text>
      {/* At least as tall as the empty state, so switching between loading,
          empty and a short list doesn't make the page jump. */}
      <View style={{ minHeight }}>{renderContent()}</View>

      {/* Same sheet as a logged meal: the recipe's name and its items, which
          come with the recipe list — no extra request. */}
      <MealSheet
        visible={isSheetOpen}
        title="Recipe details"
        onClose={closeRecipe}
        overlay={
          sheetRecipe && (
            <>
              <RenameRecipeSheet
                // Remount per opening: fresh name and no stale error.
                key={`rename-${sheetRecipe.id}-${childCount}`}
                visible={childSheet === "rename"}
                recipe={sheetRecipe}
                onClose={closeChildSheet}
                onGone={closeAll}
                onBusyChange={setIsChildBusy}
              />
              <DeleteRecipeSheet
                key={`delete-${sheetRecipe.id}-${childCount}`}
                visible={childSheet === "delete"}
                recipe={sheetRecipe}
                onClose={closeChildSheet}
                onDeleted={closeAll}
                onBusyChange={setIsChildBusy}
              />
            </>
          )
        }
        footer={
          <RecipeSheetFooter
            onLog={handleLogRecipe}
            isLogging={isLogging}
            onRename={() => openChildSheet("rename")}
            onDelete={() => openChildSheet("delete")}
          />
        }
      >
        {sheetRecipe && (
          <MealSheetContent
            log={{
              rawInputText: sheetRecipe.name,
              details: sheetRecipe.details ?? [],
            }}
          />
        )}
      </MealSheet>
    </View>
  );
}
