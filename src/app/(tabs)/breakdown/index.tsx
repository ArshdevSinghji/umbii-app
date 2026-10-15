import DailyBreakdown from "@/components/breakdown";
import { RefreshProvider } from "@/lib/pull-to-refresh";
import { SafeAreaView } from "react-native-safe-area-context";

// No ScrollView here: the calendar at the top handles its own vertical drag
// (month <-> week), so only the content under it scrolls, inside
// DailyBreakdown. No bottom edge: that content sheet runs to the screen
// bottom, behind the floating tab bar.
export default function Breakdown() {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      {/* Pull-to-refresh on the content under the calendar. */}
      <RefreshProvider>
        <DailyBreakdown />
      </RefreshProvider>
    </SafeAreaView>
  );
}
