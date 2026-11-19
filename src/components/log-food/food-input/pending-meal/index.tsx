import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { IPendingMeal } from "../../hooks/use-meal-generation";

// Smaller as more are sent, so up to 3 fit in the bubble's width.
const IMAGE_SIZES = [120, 104, 88];

interface IProps {
  meal: IPendingMeal;
}

// The sent message, floated up out of the composer like a chat message: the
// photos (if any) over the text (if any). Sits just above the composer; its
// progress shows in the composer's placeholder.
export default function PendingMeal({ meal }: IProps) {
  return (
    <View pointerEvents="none">
      <Animated.View
        entering={FadeInDown.springify().damping(18).stiffness(180)}
        exiting={FadeOut.duration(150)}
        className="max-w-[85%] items-end gap-1.5 self-end"
      >
        {meal.images.length > 0 && (
          <View className="flex-row gap-1.5">
            {meal.images.map((image) => {
              const size = IMAGE_SIZES[meal.images.length - 1];
              return (
                <Image
                  key={image.uri}
                  source={{ uri: image.uri }}
                  contentFit="cover"
                  style={{ width: size, height: size, borderRadius: 20 }}
                />
              );
            })}
          </View>
        )}
        {meal.text ? (
          <View className="rounded-3xl rounded-br-md bg-secondary px-4 py-2.5">
            <Text className="font-sans text-base leading-5">{meal.text}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}
