import { ErrorState } from "@/components/ui/error-state";
import { Text } from "@/components/ui/text";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { IRecipe } from "@/features/recipes/recipes.types";
import { eventBus } from "@/lib/event-bus";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import RecipesEmptyState from "./empty-state";
import RecipeCarousel from "./recipe-carousel";
import RecipeCarouselSkeleton from "./recipe-carousel/loading";
import RecipeSheet from "./recipe-sheet";

// How many recipes the carousel shows; the rest are on "See all".
const CAROUSEL_COUNT = 5;

export default function Recipes() {
  const router = useRouter();
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

  const openRecipe = (recipe: IRecipe) => {
    // Don't open the sheet over the food input's keyboard.
    KeyboardController.dismiss();
    setOpenedRecipe(recipe);
    setIsSheetOpen(true);
  };

  const openAll = () => {
    KeyboardController.dismiss();
    router.push("/recipes");
  };

  const renderContent = () => {
    if (isInitialLoad) return <RecipeCarouselSkeleton />;
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
        />
      );
    }

    // Already newest first: the latest few here, the rest on "See all".
    return (
      <RecipeCarousel
        recipes={listRecipes.slice(0, CAROUSEL_COUNT)}
        onPress={openRecipe}
      />
    );
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-bold text-lg">Saved recipes</Text>
        {listRecipes.length > 0 && (
          <Pressable
            onPress={openAll}
            hitSlop={8}
            accessibilityRole="button"
            className="active:opacity-60"
          >
            <Text className="text-sm font-sans-bold text-muted-foreground">
              {`See all (${listRecipes.length})`}
            </Text>
          </Pressable>
        )}
      </View>

      {renderContent()}

      <RecipeSheet
        recipe={openedRecipe}
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </View>
  );
}
