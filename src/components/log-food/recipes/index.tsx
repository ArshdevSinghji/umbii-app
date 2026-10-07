import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { View } from "react-native";
import RecipesEmptyState from "./empty-state";
import RecipesSkeleton from "./loading";
import RecipeCard from "./recipe-card";

export default function Recipes() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { listRecipes, fetchRecipes } = useRecipesActionsHook();

  // Skeleton only for the first load, same as the stats screen.
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    fetchRecipes(user.id)
      .catch((error) => console.error("Error fetching recipes:", error))
      .finally(() => setIsInitialLoad(false));
  }, [user.id]);

  const handleCreateRecipe = () => {
    // TODO: open the create-recipe flow.
  };

  const handleRecipePress = (recipe: IRecipe) => {
    // TODO: open the recipe / log it.
  };

  const renderContent = () => {
    if (isInitialLoad) return <RecipesSkeleton />;

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
