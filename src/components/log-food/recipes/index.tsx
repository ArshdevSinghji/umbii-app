import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { ErrorState } from "@/components/ui/error-state";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
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

  const handleCreateRecipe = () => {
    // TODO: open the create-recipe flow.
  };

  const handleRecipePress = (recipe: IRecipe) => {
    // TODO: open the recipe / log it.
  };

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
      return <RecipesEmptyState onCreateRecipe={handleCreateRecipe} />;
    }

    return (
      <View className="gap-3">
        {listRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={handleRecipePress}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="gap-4">
      <Text className="font-sans-bold text-lg">Your recipes</Text>
      {renderContent()}
    </View>
  );
}
