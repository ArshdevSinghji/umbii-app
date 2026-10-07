import LogFoodComponent from "@/components/log-food";
import Meals from "@/components/log-food/meals";
import Recipes from "@/components/log-food/recipes";
import { FLOATING_INPUT_BAR_BOTTOM_OFFSET } from "@/lib/floating-tab-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogFood() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: FLOATING_INPUT_BAR_BOTTOM_OFFSET + 80,
        }}
      >
        <View className="gap-8">
          <Recipes />
          <Meals />
        </View>
      </ScrollView>
      <LogFoodComponent />
    </SafeAreaView>
  );
}
