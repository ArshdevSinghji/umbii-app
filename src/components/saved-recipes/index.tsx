import RecipeSearch from "@/components/log-food/recipes/recipe-search";
import RecipeSheet from "@/components/log-food/recipes/recipe-sheet";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { IRecipe } from "@/features/recipes/recipes.types";
import { THEME } from "@/lib/theme";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import RecipeRow from "./recipe-row";

// Client-side search over what's already loaded (one request brings every
// recipe): recipe names and the foods inside each, ignoring case and extra
// spaces.
const filterRecipes = (recipes: IRecipe[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return recipes;
  return recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(normalized) ||
      (recipe.details ?? []).some((item) =>
        item.name.toLowerCase().includes(normalized),
      ),
  );
};

// Every saved recipe, searchable, as one divided list. Opened from Log
// Food's "See all"; the recipes are already loaded there.
export default function SavedRecipes() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { listRecipes } = useRecipesActionsHook();

  const [query, setQuery] = useState("");
  const visibleRecipes = filterRecipes(listRecipes, query);

  // Kept after closing so the sheet can slide out with its content.
  const [openedRecipe, setOpenedRecipe] = useState<IRecipe | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openRecipe = (recipe: IRecipe) => {
    KeyboardController.dismiss();
    setOpenedRecipe(recipe);
    setIsSheetOpen(true);
  };

  const count = listRecipes.length;

  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="rounded-full bg-muted p-2 active:opacity-60"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <CaretLeft size={18} color={theme.foreground} />
        </Pressable>
        <View>
          <Text className="font-sans-bold text-lg">Saved recipes</Text>
          <Text className="text-xs text-muted-foreground">
            {`${count} ${count === 1 ? "recipe" : "recipes"}`}
          </Text>
        </View>
      </View>

      <RecipeSearch value={query} onChange={setQuery} />

      {/* What the bar under each recipe shows. */}
      <View className="flex-row items-center gap-4">
        <LegendDot color={theme.chart1} label="Protein kcal" />
        <LegendDot color={theme.chart4} label="Fat kcal" />
      </View>

      <FlatList
        data={visibleRecipes}
        keyExtractor={(recipe) => String(recipe.id)}
        renderItem={({ item }) => (
          <RecipeRow recipe={item} onPress={openRecipe} />
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <View className="items-center gap-1 py-6">
            <Text className="text-sm text-muted-foreground">
              {count === 0
                ? "No saved recipes yet"
                : `No recipes match "${query.trim()}"`}
            </Text>
            {count > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Text className="text-sm font-sans-bold">Clear search</Text>
              </Pressable>
            )}
          </View>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <RecipeSheet
        recipe={openedRecipe}
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}
