import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface IProps {
  weight: number;
  label: string;
  actionLabel: string;
  onActionPress: () => void;
}

export default function WeightCard({
  weight,
  label,
  actionLabel,
  onActionPress,
}: IProps) {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-4 py-4 border-0 rounded-2xl">
      <View className="gap-0.5">
        <Text className="font-sans-bold text-lg">{weight} kg</Text>
        <Text className="text-muted-foreground text-sm">{label}</Text>
      </View>
      <Button className="rounded-full" onPress={onActionPress}>
        <Text>{actionLabel}</Text>
      </Button>
    </Card>
  );
}
