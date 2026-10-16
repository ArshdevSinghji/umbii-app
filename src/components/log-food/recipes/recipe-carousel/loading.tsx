import { Skeleton } from "@/components/ui/skeleton";
import { useWindowDimensions, View } from "react-native";
import { getSlideWidth } from ".";
import { SLIDE_HEIGHT } from "./recipe-slide";

// Two slides' worth, same size as the real cards, so nothing moves on load.
export default function RecipeCarouselSkeleton() {
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = getSlideWidth(windowWidth);

  return (
    <View className="flex-row gap-3 overflow-hidden">
      {[1, 2].map((item) => (
        <Skeleton
          key={item}
          className="rounded-3xl"
          style={{ width: slideWidth, height: SLIDE_HEIGHT }}
        />
      ))}
    </View>
  );
}
