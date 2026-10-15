import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { BellRinging } from "phosphor-react-native/src/icons/BellRinging";
import { CircleIcon } from "phosphor-react-native/src/icons/Circle";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { ProfileDropdown } from "./profile-dropdown";

export default function HomeDashboardHeader() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row justify-between">
      <View>
        <Text>Welcome Back</Text>
        <Text className="text-2xl font-sans-bold">Stay on track today</Text>
      </View>
      <View className="mt-auto flex-row items-center gap-4">
        <View className="relative rounded-full bg-muted p-2">
          {/* Icons default to black without a colour, invisible in dark mode. */}
          <BellRinging size={16} color={theme.foreground} />
          {/* Unread dot on the bell's top-right corner (~7px). */}
          <View className="absolute -right-0.5 -top-0.5">
            <CircleIcon size={10} color={theme.destructive} weight="fill" />
          </View>
        </View>

        <ProfileDropdown />
      </View>
    </View>
  );
}
