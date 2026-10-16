import { Text } from "@/components/ui/text";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { IRecipe } from "@/features/recipes/recipes.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  recipe: IRecipe;
  onPress: (recipe: IRecipe) => void;
}

// A plain row (the list is divided, not boxed): name and calories, a bar of where the calories come from, then protein and fat.
export default function RecipeRow({ recipe, onPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { calories, protein, fats } = calculateNutrition(recipe.details ?? []);

  // Share of calories: 4 kcal per gram of protein, 9 per gram of fat; the
  // rest of the bar (carbs and anything else) stays muted.
  const proteinShare = calories > 0 ? Math.min(1, (protein * 4) / calories) : 0;
  const fatShare =
    calories > 0 ? Math.min(1 - proteinShare, (fats * 9) / calories) : 0;

  return (
    <Pressable
      onPress={() => onPress(recipe)}
      className="gap-2 py-3 active:opacity-60"
      accessibilityRole="button"
    >
      <View className="flex-row items-center gap-3">
        <Text className="flex-1 font-sans-bold text-sm" numberOfLines={1}>
          {recipe.name}
        </Text>
        <Text className="font-sans-bold text-sm">
          {calories.toFixed(0)}
          <Text className="text-xs text-muted-foreground">{" kcal"}</Text>
        </Text>
      </View>

      <View className="h-1.5 flex-row overflow-hidden rounded-full bg-muted">
        <View
          style={{
            width: `${proteinShare * 100}%`,
            backgroundColor: theme.chart1,
          }}
        />
        <View
          style={{ width: `${fatShare * 100}%`, backgroundColor: theme.chart4 }}
        />
      </View>

      <Text className="text-xs text-muted-foreground">
        <Text
          className="font-sans-bold text-xs"
          style={{ color: theme.chart1 }}
        >
          {`${protein.toFixed(0)}g`}
        </Text>
        {" protein · "}
        <Text
          className="font-sans-bold text-xs"
          style={{ color: theme.chart4 }}
        >
          {`${fats.toFixed(0)}g`}
        </Text>
        {" fat"}
      </Text>
    </Pressable>
  );
}
