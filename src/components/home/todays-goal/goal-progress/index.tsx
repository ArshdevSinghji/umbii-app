import { CircularProgress } from "@/components/ui/circular-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface IProps {
  // e.g. "Protein" — becomes "Protein left" or "Protein over".
  name: string;
  value: number;
  max?: number;
  color: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

// Shared tile shell so the loaded and loading states are the same size.
// Nested in a rounded-3xl card with 16px padding, so rounded-2xl keeps the
// corners concentric. Page colour keeps the tile light against the card.
const TILE_CLASS = "flex-1 items-center gap-3 rounded-2xl bg-background py-4";

export default function GoalProgress({
  name,
  value,
  max = 100,
  color,
  icon,
  isLoading,
}: IProps) {
  if (isLoading) {
    return (
      <View className={TILE_CLASS}>
        <View className="items-center gap-1">
          <Skeleton className="h-5 w-10 rounded-md bg-card" />
          <Text className="text-sm font-sans-bold leading-none">{name} left</Text>
        </View>
        <Skeleton className="h-14 w-14 rounded-full bg-card" />
      </View>
    );
  }

  const remaining = max - value;
  const isOver = remaining < 0;

  return (
    <View className={TILE_CLASS}>
      <View className="items-center gap-1">
        <Text className="font-sans-bold leading-5">
          {Math.round(Math.abs(remaining))}g
        </Text>
        <Text className="text-sm font-sans-bold leading-none">
          {name} {isOver ? "over" : "left"}
        </Text>
      </View>
      <CircularProgress
        value={value}
        max={max}
        color={color}
        strokeWidth={8}
        trackStrokeWidth={4}
      >
        <View className="p-1 rounded-full bg-card">{icon}</View>
      </CircularProgress>
    </View>
  );
}
