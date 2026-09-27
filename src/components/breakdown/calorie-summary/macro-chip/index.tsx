import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface IProps {
  label: string;
  value: number;
  color: string;
}

export default function MacroChip({ label, value, color }: IProps) {
  return (
    <View className="flex-1 items-center rounded-2xl py-3 gap-0.5">
      <Text style={{ color }} className="font-sans-bold text-base">
        {value.toFixed(0)} g
      </Text>
      <Text className="text-muted-foreground text-xs">{label}</Text>
    </View>
  );
}
