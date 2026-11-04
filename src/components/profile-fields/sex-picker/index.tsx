import { Text } from "@/components/ui/text";
import { Sex } from "@/features/user/user.types";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";

interface IProps {
  value: Sex | null;
  onChange: (sex: Sex) => void;
}

const SEXES: { value: Sex; label: string }[] = [
  { value: Sex.Male, label: "Male" },
  { value: Sex.Female, label: "Female" },
];

// A two-way switch.
export default function SexPicker({ value, onChange }: IProps) {
  return (
    <View className="flex-row gap-1.5 rounded-2xl bg-card p-1.5">
      {SEXES.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "h-11 flex-1 items-center justify-center rounded-xl active:opacity-70",
              isSelected && "bg-primary",
            )}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className={cn(
                "font-sans-bold text-sm",
                isSelected
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
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
