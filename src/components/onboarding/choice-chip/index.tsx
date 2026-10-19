import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable } from "react-native";

interface IProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  // Multi-selects read as checkboxes to screen readers.
  multiple?: boolean;
  className?: string;
}

// A pill option: filled when selected, outlined otherwise.
export default function ChoiceChip({
  label,
  isSelected,
  onPress,
  multiple = false,
  className,
}: IProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "h-11 items-center justify-center rounded-full border px-4 active:opacity-70",
        isSelected ? "border-primary bg-primary" : "border-border bg-card",
        className,
      )}
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityState={
        multiple ? { checked: isSelected } : { selected: isSelected }
      }
    >
      <Text
        className={cn(
          "font-sans-bold text-sm",
          isSelected && "text-primary-foreground",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
