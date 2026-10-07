import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";

interface IProps {
  label: string;
  value: number;
  unit: string;
  isGood: boolean;
  icon: React.ReactNode;
}

export default function NutrientRow({
  label,
  value,
  unit,
  isGood,
  icon,
}: IProps) {
  return (
    <View className="flex-row justify-between items-center py-2">
      <View className="flex-row gap-2 items-center">
        {icon}
        <Text>{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="font-sans-bold">
          {value.toFixed(0)}
          {unit}
        </Text>
        <View
          className={cn(
            "w-2 h-2 rounded-full",
            isGood ? "bg-green-500" : "bg-red-500",
          )}
        />
      </View>
    </View>
  );
}
