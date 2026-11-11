import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { BookmarkSimple } from "phosphor-react-native/src/icons/BookmarkSimple";
import { Trash } from "phosphor-react-native/src/icons/Trash";
import { View } from "react-native";

interface IProps {
  log: IFoodLog;
  // Each opens its child sheet over the meal sheet.
  onSave: () => void;
  onDelete: () => void;
}

// Bottom of a logged meal's sheet (Home and Log Food): delete as a round
// icon, then "Save as recipe", or a note once it's linked to a recipe.
export default function MealFooter({ log, onSave, onDelete }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row items-center gap-2 pt-4">
      {/* Same 48px height as the action button. */}
      <Button
        variant="destructive"
        size="icon"
        className="h-12 w-12 rounded-full"
        onPress={onDelete}
        accessibilityLabel="Delete meal"
      >
        <Trash size={18} color="#FFFFFF" />
      </Button>
      {log.recipeId !== null ? (
        <View className="flex-1 flex-row items-center justify-center gap-2">
          <BookmarkSimple size={16} color={theme.chart2} weight="fill" />
          <Text className="text-sm text-muted-foreground">In your recipes</Text>
        </View>
      ) : (
        <ActionButton
          className="flex-1"
          label="Save as recipe"
          onPress={onSave}
        />
      )}
    </View>
  );
}
