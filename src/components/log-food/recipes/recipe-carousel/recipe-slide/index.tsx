import { Text } from "@/components/ui/text";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { IRecipe } from "@/features/recipes/recipes.types";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

// Fixed so every slide (and its skeleton) is the same height.
export const SLIDE_HEIGHT = 188;

// Dark charcoal in both themes, so saved recipes stand apart from the light
// lists around them. Dark mode adds a hairline so it lifts off the page.
const SLIDE_SURFACE = {
  light: { colors: ["#2C2C30", "#18181B"] as const, border: "transparent" },
  dark: {
    colors: ["#303034", "#161618"] as const,
    border: "rgba(255, 255, 255, 0.08)",
  },
};

interface IProps {
  recipe: IRecipe;
  width: number;
  onPress: (recipe: IRecipe) => void;
}

// Name, total calories big, then protein and fat (summed across the
// recipe's items; the API sends no totals).
export default function RecipeSlide({ recipe, width, onPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const surface = SLIDE_SURFACE[colorScheme ?? "light"];
  const { calories, protein, fats } = calculateNutrition(recipe.details ?? []);

  return (
    <Pressable
      onPress={() => onPress(recipe)}
      className="active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={`${recipe.name}, ${calories.toFixed(0)} kcal`}
    >
      <View
        className="justify-between rounded-3xl border p-4"
        style={{ width, height: SLIDE_HEIGHT, borderColor: surface.border }}
      >
        {/* Rounded itself rather than clipping the card (keeps it cheap). */}
        <LinearGradient
          colors={surface.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 23,
          }}
        />

        <Text
          className="h-12 font-sans-bold text-base text-white"
          numberOfLines={2}
        >
          {recipe.name}
        </Text>

        <Text className="font-sans-bold text-4xl text-white">
          {calories.toFixed(0)}
          <Text className="text-sm text-white/60">{" kcal"}</Text>
        </Text>

        <View className="gap-2">
          <View className="h-px bg-white/10" />
          <View className="flex-row gap-8">
            <Macro label="Protein" grams={protein} color={theme.chart1} />
            <Macro label="Fat" grams={fats} color={theme.chart4} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Macro({
  label,
  grams,
  color,
}: {
  label: string;
  grams: number;
  color: string;
}) {
  return (
    <View>
      <Text className="text-xs text-white/60">{label}</Text>
      <Text className="font-sans-bold text-base" style={{ color }}>
        {`${grams.toFixed(0)}g`}
      </Text>
    </View>
  );
}
