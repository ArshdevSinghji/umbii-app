import LogFoodComponent from "@/components/log-food";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogFood() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
      >
        <LogFoodComponent />
      </ScrollView>
    </SafeAreaView>
  );
}
