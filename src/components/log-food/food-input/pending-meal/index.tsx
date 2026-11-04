import { Text } from "@/components/ui/text";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { IPendingMeal } from "../../hooks/use-meal-generation";

interface IProps {
  meal: IPendingMeal;
}

// The sent message, floated up out of the composer like a chat message.
// Sits just above the composer; its progress shows in the composer's
// placeholder.
export default function PendingMeal({ meal }: IProps) {
  return (
    <View pointerEvents="none">
      <Animated.View
        entering={FadeInDown.springify().damping(18).stiffness(180)}
        exiting={FadeOut.duration(150)}
        className="max-w-[85%] self-end rounded-3xl rounded-br-md bg-secondary px-4 py-2.5"
      >
        <Text className="font-sans text-base leading-5">{meal.text}</Text>
      </Animated.View>
    </View>
  );
}
