import HomeDashboard from "@/components/dashboard/home-dashboard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 pt-8 px-4 bg-background">
      <HomeDashboard />
    </SafeAreaView>
  );
}
