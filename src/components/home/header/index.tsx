import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { BellRing, Dot } from "lucide-react-native";
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
          {/* Lucide defaults to black without a colour, invisible in dark mode. */}
          <BellRing size={16} color={theme.foreground} />
          <View className="absolute -top-2 -right-2">
            <Dot
              strokeWidth={5}
              stroke={theme.destructive}
              fill={theme.destructive}
            />
          </View>
        </View>

        <ProfileDropdown />
      </View>
    </View>
  );
}
