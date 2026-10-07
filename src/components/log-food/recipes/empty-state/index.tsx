import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Image, View } from "react-native";

interface IProps {
  onCreateRecipe: () => void;
}

export default function RecipesEmptyState({ onCreateRecipe }: IProps) {
  return (
    <Card className="items-center gap-4 px-6 py-8">
      {/* Full-colour sticker on transparency — reads fine in both themes. */}
      <Image
        source={require("@/assets/images/fresh-cooked-fried-egg-pan-sticker-vector.png")}
        className="h-36 w-36"
        resizeMode="contain"
      />
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg">No recipes yet</Text>
        <Text className="text-center text-sm text-muted-foreground">
          Save the meals you make often as recipes, so you can log them in one
          tap.
        </Text>
      </View>
      <Button className="rounded-full" onPress={onCreateRecipe}>
        <Text>Create a recipe</Text>
      </Button>
    </Card>
  );
}
