import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

interface IProps {
  title: string;
  subtitle?: string;
  // Shown in a rounded square on the left.
  icon?: ReactNode;
  isSelected: boolean;
  onPress: () => void;
  multiple?: boolean;
}

// A full-width option card: outlined in the foreground colour when picked.
// Multi-select cards also get a checkbox on the right, so it's clear more
// than one can be ticked.
export default function ChoiceCard({
  title,
  subtitle,
  icon,
  isSelected,
  onPress,
  multiple = false,
}: IProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-3 rounded-2xl border bg-card p-3 active:opacity-70",
        isSelected ? "border-foreground" : "border-border",
      )}
      accessibilityRole={multiple ? "checkbox" : "radio"}
      accessibilityState={
        multiple ? { checked: isSelected } : { selected: isSelected }
      }
    >
      {icon && (
        <View className="size-10 items-center justify-center rounded-xl bg-muted">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="font-sans-bold text-sm">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-muted-foreground">{subtitle}</Text>
        )}
      </View>
      {multiple && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onPress}
          className="size-5 rounded-md"
          // The card already announces itself as a checkbox.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      )}
    </Pressable>
  );
}
