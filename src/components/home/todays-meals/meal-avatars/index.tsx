import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Plus } from "phosphor-react-native/src/icons/Plus";
import { View } from "react-native";

// Stand-ins until meals have their own photos (the backend stores none yet).
const PLACEHOLDER_IMAGES = [
  require("@/assets/images/avocado-toast.png"),
  require("@/assets/images/oat-bowl.png"),
  require("@/assets/images/egg-toast.png"),
];
const MAX_AVATARS = 3;

interface IProps {
  // How many items the meal has: one photo each, up to three.
  itemCount: number;
  // Rotates which placeholder comes first, so cards next to each other
  // don't all look the same.
  seed: number;
}

// Overlapping round photos (12px of each 36px circle hidden under the next),
// ending in a "+" — where adding your own photo will go, replacing one of
// the placeholders. The ring is the card colour, so each circle reads as cut
// out of the one before it.
export default function MealAvatars({ itemCount, seed }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const shown = Math.min(itemCount, MAX_AVATARS);

  return (
    <View className="flex-row items-center">
      {Array.from({ length: shown }, (_, index) => (
        <Avatar
          key={index}
          alt=""
          className="-mr-3 size-9 border-2 border-card"
        >
          <AvatarImage
            source={
              PLACEHOLDER_IMAGES[(seed + index) % PLACEHOLDER_IMAGES.length]
            }
          />
        </Avatar>
      ))}
      {/* Upload isn't wired up yet (no photo storage); a visual for now. */}
      <View className="size-9 items-center justify-center rounded-full border-2 border-card bg-muted">
        <Plus size={14} color={theme.foreground} weight="bold" />
      </View>
    </View>
  );
}
