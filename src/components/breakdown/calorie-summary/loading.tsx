import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Flame } from "lucide-react-native";
import { ReactNode } from "react";
import { View } from "react-native";
import { CALORIE_COLOR } from ".";

interface IProps {
  title: string;
  // Rendered for real (not as a skeleton) so it stays put and usable.
  action?: ReactNode;
}

// Mirrors CalorieSummary: static text and the dropdown render for real; each
// number is a placeholder boxed to its line height (text-3xl 36px, text-sm
// 20px, text-xs 16px, text-base 24px) so nothing moves when data lands.
export default function CalorieSummarySkeleton({ title, action }: IProps) {
  return (
    <Card className="gap-4 px-4 py-4">
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-row items-center gap-2">
          <View
            className="rounded-xl p-2"
            style={{ backgroundColor: "rgba(255, 90, 0, 0.12)" }}
          >
            <Flame size={16} color={CALORIE_COLOR} fill={CALORIE_COLOR} />
          </View>
          <Text className="font-sans-bold">{title}</Text>
        </View>
        {action}
      </View>

      <View className="gap-0.5">
        <View className="h-9 justify-center">
          <Skeleton className="h-7 w-36 rounded-md" />
        </View>
        <View className="h-5 justify-center">
          <Skeleton className="h-3.5 w-32 rounded-full" />
        </View>
      </View>

      <View className="gap-1.5">
        <Skeleton className="h-5 w-full rounded-full" />
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">0</Text>
          <View className="h-4 justify-center">
            <Skeleton className="h-3 w-10 rounded-full" />
          </View>
        </View>
      </View>

      <Separator />

      <View className="flex-row gap-3">
        {["Protein", "Carbs", "Fats"].map((label) => (
          <View
            key={label}
            className="flex-1 items-center gap-0.5 rounded-2xl py-3"
          >
            <View className="h-6 justify-center">
              <Skeleton className="h-4 w-10 rounded-md" />
            </View>
            <Text className="text-xs text-muted-foreground">{label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
