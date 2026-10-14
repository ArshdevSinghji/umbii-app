import LogFoodComponent from "@/components/log-food";
import Meals from "@/components/log-food/meals";
import Recipes from "@/components/log-food/recipes";
import { FLOATING_INPUT_BAR_BOTTOM_OFFSET } from "@/lib/floating-tab-bar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogFood() {
  // Close the food input's keyboard when leaving this tab, so it doesn't
  // stay open over the next screen.
  useFocusEffect(
    useCallback(
      () => () => {
        KeyboardController.dismiss();
      },
      [],
    ),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        // Tapping empty space or dragging closes the keyboard; taps on
        // buttons still work first time instead of only closing it.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
