import Notifications from "@/components/notifications";
import { Stack } from "expo-router";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// No SafeAreaView: the dark header runs up under the status bar and pads
// itself by the inset.
export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Notifications />
    </ScrollView>
  );
}
