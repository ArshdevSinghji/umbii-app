import SavedRecipes from "@/components/saved-recipes";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Recipes() {
  // Insets come from the provider up front, unlike <SafeAreaView>, which
  // measures after layout and can shift while the screen slides in.
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background px-4 pt-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <SavedRecipes />
    </View>
  );
}
