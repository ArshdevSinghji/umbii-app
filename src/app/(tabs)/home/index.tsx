import HomeDashboard from "@/components/home";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import { RefreshProvider, RefreshableScrollView } from "@/lib/pull-to-refresh";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <RefreshProvider>
        <RefreshableScrollView
          contentContainerStyle={{
            paddingTop: 32,
            paddingHorizontal: 16,
            paddingBottom: FLOATING_TAB_BAR_CLEARANCE,
          }}
        >
          <HomeDashboard />
        </RefreshableScrollView>
      </RefreshProvider>
    </SafeAreaView>
  );
}
