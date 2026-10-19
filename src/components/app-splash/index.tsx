import { Text } from "@/components/ui/text";
import { useVideoPlayer, VideoView } from "expo-video";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

// One clip per theme. Both are the egg until the light and dark versions
// arrive; swap the files here.
const SPLASH_VIDEO = {
  light: require("@/assets/videos/jumping-egg.mp4"),
  dark: require("@/assets/videos/jumping-egg.mp4"),
};

const VIDEO_SIZE = 220;

interface IProps {
  // A line under the video, e.g. "Building your plan".
  caption?: string;
}

// Full-screen loading screen with the looping animation: shown while the
// account loads after sign-in, and while a plan is being built. Covers
// whatever is behind it.
export default function AppSplash({ caption }: IProps) {
  const { colorScheme } = useColorScheme();
  const player = useVideoPlayer(SPLASH_VIDEO[colorScheme ?? "light"], (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View
      className="absolute inset-0 items-center justify-center gap-4 bg-background"
      accessibilityRole="progressbar"
      accessibilityLabel={caption ?? "Loading"}
    >
      <VideoView
        player={player}
        style={{ width: VIDEO_SIZE, height: VIDEO_SIZE }}
        nativeControls={false}
        contentFit="contain"
        allowsPictureInPicture={false}
      />
      {caption && (
        <Text className="text-sm text-muted-foreground">{caption}</Text>
      )}
    </View>
  );
}
