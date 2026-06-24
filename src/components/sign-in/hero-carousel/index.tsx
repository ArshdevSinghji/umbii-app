import React from "react";
import { Dimensions, Image, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const DATA = [
  { id: 1, image: "https://opendoodles.s3-us-west-1.amazonaws.com/Doggie.svg" },
  {
    id: 2,
    image: "https://opendoodles.s3-us-west-1.amazonaws.com/meditating.svg",
  },
  {
    id: 3,
    image: "https://opendoodles.s3-us-west-1.amazonaws.com/dancing.svg",
  },
];

export function HeroCarousel() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  return (
    <View>
      <Carousel
        ref={ref}
        loop
        width={width}
        height={400}
        data={DATA}
        autoPlay
        autoPlayInterval={4000}
        pagingEnabled
        snapEnabled
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={{ width: width, height: 400 }}
          />
        )}
      />
    </View>
  );
}
