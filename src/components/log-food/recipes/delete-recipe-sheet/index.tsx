import ChildSheet from "@/components/meal-sheet/child-sheet";
import { ActionButton } from "@/components/ui/action-button";
import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useEffect } from "react";
import { View } from "react-native";
import { useManageRecipe } from "../hooks/use-manage-recipe";

interface IProps {
  visible: boolean;
  recipe: IRecipe;
  onClose: () => void;
  // Deleted (or already gone): close the recipe sheet too.
  onDeleted: () => void;
  // Lets the parent refuse to close while the delete is in flight.
  onBusyChange: (isBusy: boolean) => void;
}

// Delete confirmation as a child sheet over the recipe sheet. The food log
// stays in the diary; its recipeId goes back to null so it can be saved again.
export default function DeleteRecipeSheet({
  visible,
  recipe,
  onClose,
  onDeleted,
  onBusyChange,
}: IProps) {
  const { remove, isBusy, error } = useManageRecipe();

  useEffect(() => {
    onBusyChange(isBusy);
  }, [isBusy, onBusyChange]);

  const handleClose = () => {
    if (!isBusy) onClose();
  };

  const handleDelete = async () => {
    const result = await remove(recipe);
    if (result !== "error") onDeleted();
  };

  return (
    <ChildSheet
      visible={visible}
      title="Delete this recipe?"
      description="The meal stays in your history, and you can save it as a recipe again later."
      onClose={handleClose}
    >
      {error && <Text className="text-sm text-destructive">{error}</Text>}
      <View className="flex-row gap-2">
        <ActionButton
          className="flex-1"
          variant="outline"
          label="Cancel"
          onPress={handleClose}
          disabled={isBusy}
        />
        <ActionButton
          className="flex-1"
          variant="destructive"
          label="Delete"
          onPress={handleDelete}
          isLoading={isBusy}
        />
      </View>
    </ChildSheet>
  );
}
