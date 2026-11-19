import { Skeleton } from "@/components/ui/skeleton";
import { IMealImage } from "@/features/food-logs/generate-food-logs/generate-food-logs.types";
import { Image } from "expo-image";
import { X } from "phosphor-react-native/src/icons/X";
import { Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const SIZE = 72;
const RADIUS = 16;

interface IProps {
  images: IMealImage[];
  // Picked but still being resized: placeholders after the ready ones.
  preparingCount: number;
  onRemove: (uri: string) => void;
}

// The attached photos, in a row on top of the composer (like a chat app's
// attachments), each with an "x" to drop it.
export default function AttachedImages({
  images,
  preparingCount,
  onRemove,
}: IProps) {
  return (
    <View className="flex-row gap-2">
      {images.map((image, index) => (
        <Animated.View
          key={image.uri}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          layout={LinearTransition.duration(150)}
          style={{ width: SIZE, height: SIZE }}
        >
          <Image
            source={{ uri: image.uri }}
            contentFit="cover"
            style={{ width: SIZE, height: SIZE, borderRadius: RADIUS }}
            accessibilityLabel={`Attached meal photo ${index + 1}`}
          />
          <Pressable
            onPress={() => onRemove(image.uri)}
            hitSlop={8}
            accessibilityLabel={`Remove photo ${index + 1}`}
            className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/60"
          >
            <X size={12} weight="bold" color="white" />
          </Pressable>
        </Animated.View>
      ))}
      {Array.from({ length: preparingCount }, (_, index) => (
        <Skeleton
          key={`preparing-${index}`}
          style={{ width: SIZE, height: SIZE, borderRadius: RADIUS }}
        />
      ))}
    </View>
  );
}
