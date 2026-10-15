import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade";
import GoalProgress from "@/components/stats";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import { RefreshProvider, RefreshableScrollView } from "@/lib/pull-to-refresh";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
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
          <GoalProgress />
        </RefreshableScrollView>
      </RefreshProvider>
      <ScrollEdgeFade />
    </SafeAreaView>
  );
}
