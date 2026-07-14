import HomeDashboard from "@/components/dashboard/home-dashboard";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 32,
          paddingHorizontal: 16,
        }}
      >
        <HomeDashboard />
      </ScrollView>
    </SafeAreaView>
  );
}
