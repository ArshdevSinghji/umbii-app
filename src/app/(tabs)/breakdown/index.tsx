import DailyBreakdown from "@/components/breakdown";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Breakdown() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 32,
          paddingHorizontal: 16,
          paddingBottom: FLOATING_TAB_BAR_CLEARANCE,
        }}
      >
        <DailyBreakdown />
      </ScrollView>
    </SafeAreaView>
  );
}
