import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";

const ACTIVE_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
};

interface IProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  // Stretch options to fill the width (filters) or size to content (unit toggles).
  fill?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fill = false,
  className,
}: IProps<T>) {
  return (
    <View className={cn("flex-row bg-muted rounded-full p-1", className)}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "items-center justify-center rounded-full py-2",
              fill ? "flex-1" : "px-4",
              isActive && "bg-background",
            )}
            style={isActive ? ACTIVE_SHADOW : undefined}
          >
            <Text
              className={cn(
                "text-sm font-sans-bold",
                !isActive && "text-muted-foreground",
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
