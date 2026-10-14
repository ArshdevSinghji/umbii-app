import ChildSheet from "@/components/meal-sheet/child-sheet";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useManageRecipe } from "../hooks/use-manage-recipe";

interface IProps {
  visible: boolean;
  recipe: IRecipe;
  onClose: () => void;
  // The recipe no longer exists (404): close the parent sheet too.
  onGone: () => void;
  // Lets the parent refuse to close while the rename is in flight.
  onBusyChange: (isBusy: boolean) => void;
}

// Rename (the only editable field) as a child sheet over the recipe sheet.
export default function RenameRecipeSheet({
  visible,
  recipe,
  onClose,
  onGone,
  onBusyChange,
}: IProps) {
  const [name, setName] = useState(recipe.name);
  const { rename, isBusy, error, clearError } = useManageRecipe();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    onBusyChange(isBusy);
  }, [isBusy, onBusyChange]);

  // Focused straight away. autoFocus is unreliable inside a Modal (it can
  // fire before the field is ready on Android), so focus after it renders.
  // (The parent remounts this per opening, so the name starts fresh.)
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, [visible]);

  const handleClose = () => {
    if (!isBusy) onClose();
  };

  const handleSave = async () => {
    const result = await rename(recipe, name);
    if (result === "done") onClose();
    if (result === "gone") onGone();
  };

  return (
    <ChildSheet visible={visible} title="Rename recipe" onClose={handleClose}>
      <View className="gap-2">
        <Label>Recipe name</Label>
        <Input
          ref={inputRef}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) clearError();
          }}
          editable={!isBusy}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={120}
        />
        {error && <Text className="text-sm text-destructive">{error}</Text>}
      </View>
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
          label="Save name"
          onPress={handleSave}
          isLoading={isBusy}
        />
      </View>
    </ChildSheet>
  );
}
