import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { getDefaultRecipeName, useSaveRecipe } from "../hooks/use-save-recipe";

interface IProps {
  log: IFoodLog;
  onDone: () => void;
  onCancel: () => void;
  // Lets a parent sheet refuse to close while the request is in flight.
  onSavingChange?: (isSaving: boolean) => void;
}

// Name field + Cancel / Save. Used inside Home's meal sheet and in
// SaveRecipeSheet for the Recent meals bookmark.
export default function SaveRecipeForm({
  log,
  onDone,
  onCancel,
  onSavingChange,
}: IProps) {
  const [name, setName] = useState(() => getDefaultRecipeName(log));
  const { save, isSaving, error, clearError } = useSaveRecipe();
  const inputRef = useRef<TextInput>(null);

  // autoFocus is unreliable inside a Modal (it can fire before the field is
  // ready on Android), so focus once the form has rendered.
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    onSavingChange?.(true);
    const shouldClose = await save(log, name);
    onSavingChange?.(false);
    if (shouldClose) onDone();
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Label>Recipe name</Label>
        <Input
          ref={inputRef}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) clearError();
          }}
          placeholder="e.g. Post-workout protein oats"
          editable={!isSaving}
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
          onPress={onCancel}
          disabled={isSaving}
        />
        <ActionButton
          className="flex-1"
          label="Save recipe"
          onPress={handleSave}
          isLoading={isSaving}
        />
      </View>
    </View>
  );
}
