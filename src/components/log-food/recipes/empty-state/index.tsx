import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Image, LayoutChangeEvent, View } from "react-native";

interface IProps {
  // Recipes only come from logged meals, so "adding" one starts by logging a
  // meal: this focuses the food input below.
  onAddRecipe: () => void;
  // Reports this card's height, used as the recipes section's min height.
  onLayout?: (event: LayoutChangeEvent) => void;
}

export default function RecipesEmptyState({ onAddRecipe, onLayout }: IProps) {
  return (
    <Card className="items-center gap-4 px-6 py-8" onLayout={onLayout}>
      {/* Full-colour sticker on transparency — reads fine in both themes. */}
      <Image
        source={require("@/assets/images/fresh-cooked-fried-egg-pan-sticker-vector.png")}
        className="h-36 w-36"
        resizeMode="contain"
      />
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg">No recipes yet</Text>
        <Text className="text-center text-sm text-muted-foreground">
          Log a meal, then tap the bookmark on it to save it as a recipe.
        </Text>
      </View>
      <Button className="rounded-full" onPress={onAddRecipe}>
        <Text>Add a recipe</Text>
      </Button>
    </Card>
  );
}
