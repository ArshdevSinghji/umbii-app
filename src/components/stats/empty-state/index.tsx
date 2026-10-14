import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Image, View } from "react-native";

interface IProps {
  onGetStarted: () => void;
}

// Same layout as the recipes empty state, so empty states read as one family.
export default function WeightEmptyState({ onGetStarted }: IProps) {
  return (
    <Card className="items-center gap-4 px-6 py-8">
      {/* White-bordered sticker on transparency — reads fine in both themes. */}
      <Image
        source={require("@/assets/images/lifting-dumbbell-doodle-sticker-with-white-border-vector.png")}
        className="h-36 w-36"
        resizeMode="contain"
      />
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg">
          Start tracking your weight
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          Log your current weight and set a goal to see your progress here.
        </Text>
      </View>
      <Button className="rounded-full" onPress={onGetStarted}>
        <Text>Get started</Text>
      </Button>
    </Card>
  );
}
