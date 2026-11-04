import { ScrollEdgeFade } from "@/components/ui/scroll-edge-fade";
import LogFoodComponent from "@/components/log-food";
import Meals from "@/components/log-food/meals";
import Recipes from "@/components/log-food/recipes";
import { FLOATING_INPUT_BAR_BOTTOM_OFFSET } from "@/lib/floating-tab-bar";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshProvider, RefreshableScrollView } from "@/lib/pull-to-refresh";
import { View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

// The food input as a one-row pill (36px row + 8px padding + 1px border
// each side). Only a starting value; it reports its real height.
const FOOD_INPUT_MIN_HEIGHT = 54;

export default function LogFood() {
  // The food input grows with its text; the list makes room under it so the
  // last meal can always scroll clear of it.
  const [composerHeight, setComposerHeight] = useState(FOOD_INPUT_MIN_HEIGHT);

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
      <RefreshProvider>
        <RefreshableScrollView
          // Tapping empty space or dragging closes the keyboard; taps on
          // buttons still work first time instead of only closing it.
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom:
              FLOATING_INPUT_BAR_BOTTOM_OFFSET + composerHeight + 22,
          }}
        >
          <View className="gap-8">
            <Recipes />
            <Meals />
          </View>
        </RefreshableScrollView>
      </RefreshProvider>
      {/* Between the list and the food input floating over it. */}
      <ScrollEdgeFade foodInputHeight={composerHeight} />
      <LogFoodComponent onComposerHeightChange={setComposerHeight} />
    </SafeAreaView>
  );
}
