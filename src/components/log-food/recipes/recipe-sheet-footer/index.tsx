import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react-native";
import { View } from "react-native";

interface IProps {
  onLog: () => void;
  isLogging: boolean;
  // Each opens its child sheet over the recipe sheet.
  onRename: () => void;
  onDelete: () => void;
}

// Bottom of the recipe sheet, in one row: delete (icon), rename, then the
// main action, widest, on the right. Rename and delete confirm in child
// sheets drawn inside the same Modal.
export default function RecipeSheetFooter({
  onLog,
  isLogging,
  onRename,
  onDelete,
}: IProps) {
  return (
    <View className="flex-row gap-2 pt-4">
      {/* Round icon button, same 48px height as the others. */}
      <Button
        variant="destructive"
        size="icon"
        className="h-12 w-12 rounded-full"
        onPress={onDelete}
        disabled={isLogging}
        accessibilityLabel="Delete recipe"
      >
        <Trash2 size={18} color="#FFFFFF" />
      </Button>
      <ActionButton
        className="flex-1 px-2"
        variant="outline"
        label="Rename"
        onPress={onRename}
        disabled={isLogging}
      />
      <ActionButton
        className="flex-[1.5] px-2"
        label="Log this meal"
        onPress={onLog}
        isLoading={isLogging}
      />
    </View>
  );
}
