import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import { THEME } from "@/lib/theme";
import { ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

interface IProps {
  recipe: IRecipe;
  onPress: (recipe: IRecipe) => void;
}

export default function RecipeCard({ recipe, onPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Pressable onPress={() => onPress(recipe)} className="active:opacity-70">
      <Card className="flex-row items-center justify-between gap-4 px-4 py-4">
        <Text className="flex-1 font-sans-bold" numberOfLines={1}>
          {recipe.name}
        </Text>
        <ChevronRight size={18} color={theme.mutedForeground} />
      </Card>
    </Pressable>
  );
}
