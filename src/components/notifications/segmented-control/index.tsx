import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";

interface IProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

// Small pill switcher for a row's right side (e.g. Daily / Weekly).
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: IProps<T>) {
  return (
    <View className="flex-row gap-1 rounded-full bg-muted p-1">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => !isSelected && onChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1.5 active:opacity-70",
              isSelected && "bg-background",
            )}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className={cn(
                "text-xs",
                isSelected ? "font-sans-bold" : "text-muted-foreground",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
