import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import BmiLegend from "./bmi-legend";

interface IProps {
  // Known from the persisted user, so the skeleton matches the variant
  // that will actually render.
  hasHeight: boolean;
}

export default function BmiCardSkeleton({ hasHeight }: IProps) {
  if (!hasHeight) {
    // The "add height" card has no data in it; render it for real.
    return (
      <Card className="gap-3 px-4 py-4">
        <Text className="font-sans-bold text-lg">Your BMI</Text>
        <Text className="text-sm text-muted-foreground">
          Add your height to see your Body Mass Index.
        </Text>
        <Button className="self-start rounded-full" disabled>
          <Text>Add height</Text>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="gap-4 px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-bold text-lg">Your BMI</Text>
        {/* Height pill: py-1.5 + a text-xs line = 28px. */}
        <Skeleton className="h-7 w-32 rounded-full" />
      </View>

      {/* Value row is as tall as its text-2xl number (32px). */}
      <View className="h-8 flex-row items-center gap-2">
        <Skeleton className="h-7 w-12 rounded-md" />
        <Text className="text-sm text-muted-foreground">Your weight is</Text>
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>

      {/* Scale: 24px row (the marker's height) with the 10px bar centred. */}
      <View className="h-6 justify-center">
        <Skeleton className="h-2.5 w-full rounded-full" />
      </View>

      <BmiLegend />
    </Card>
  );
}
