import { CircularProgress } from "@/components/ui/circular-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";

interface IProps {
  left: number;
  value: number;
  label: string;
  max?: number;
  color: string;
  bgColor?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export default function GoalProgress({
  left,
  value,
  label,
  max = 100,
  color,
  bgColor = "bg-primary",
  icon,
  isLoading,
}: IProps) {
  if (isLoading) {
    return (
      <View className="items-center gap-3">
        <View className="items-center gap-1">
          <Skeleton className="h-5 w-8 rounded-md" />
          <Text className="text-sm font-sans-bold leading-none">{label}</Text>
        </View>
        <Skeleton className="h-14 w-14 rounded-full" />
      </View>
    );
  }

  return (
    <View className="items-center gap-3">
      <View className="items-center">
        <Text className="font-sans-bold">{left}g</Text>
        <Text className="text-sm font-sans-bold leading-none">{label}</Text>
      </View>
      <CircularProgress
        value={value}
        max={max}
        color={color}
        strokeWidth={8}
        trackStrokeWidth={4}
      >
        <View className={cn(bgColor, "p-1", "rounded-full")}>{icon}</View>
      </CircularProgress>
    </View>
  );
}