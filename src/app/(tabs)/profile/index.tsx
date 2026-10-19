import Profile from "@/components/profile";
import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import { RefreshProvider, RefreshableScrollView } from "@/lib/pull-to-refresh";
import { View } from "react-native";

// No SafeAreaView: the dark header runs up under the status bar and pads
// itself by the inset.
export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background">
      <RefreshProvider>
        <RefreshableScrollView
          // Extra room so the last row (Sign out) clears the fade and the
          // floating tab bar.
          contentContainerStyle={{
            paddingBottom: FLOATING_TAB_BAR_CLEARANCE + 32,
          }}
        >
          <Profile />
        </RefreshableScrollView>
      </RefreshProvider>
      <ScrollEdgeFade />
    </View>
  );
}
