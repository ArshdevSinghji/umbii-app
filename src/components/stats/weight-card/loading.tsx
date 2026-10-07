import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface IProps {
  label: string;
  actionLabel: string;
}

// Static text and the button render for real; only the weight is a
// placeholder, boxed to the exact height of its text-lg line (28px).
export default function WeightCardSkeleton({ label, actionLabel }: IProps) {
  return (
    <Card className="flex-row items-center justify-between gap-4 px-4 py-4">
      <View className="gap-0.5">
        <View className="h-7 justify-center">
          <Skeleton className="h-5 w-16 rounded-md" />
        </View>
        <Text className="text-muted-foreground text-sm">{label}</Text>
      </View>
      <Button className="rounded-full" disabled>
        <Text>{actionLabel}</Text>
      </Button>
    </Card>
  );
}
