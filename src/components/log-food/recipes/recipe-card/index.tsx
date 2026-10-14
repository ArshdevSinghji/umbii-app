import { Pressable } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import MealMacros from "../../meal-macros";

interface IProps {
  recipe: IRecipe;
  onPress: (recipe: IRecipe) => void;
}

// Name plus the meal's totals, summed across its items (the API sends no
// recipe totals). Same rows and heights as a meal card.
export default function RecipeCard({ recipe, onPress }: IProps) {
  return (
    <Pressable onPress={() => onPress(recipe)} className="active:opacity-70">
      <Card className="gap-2 px-4 py-3">
        <Text className="text-sm font-sans-bold" numberOfLines={1}>
          {recipe.name}
        </Text>
        <MealMacros details={recipe.details ?? []} />
      </Card>
    </Pressable>
  );
}
