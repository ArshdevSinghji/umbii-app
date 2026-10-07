import HealthDetailsForm from "@/components/health-details";
import { healthDetailsModeSchema } from "@/components/health-details/health-details.schema";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HealthDetails() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = healthDetailsModeSchema.parse(params.mode);

  // Insets come from the provider up front, unlike <SafeAreaView>, which
  // measures after layout and can shift while the screen slides in.
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <HealthDetailsForm mode={mode} />
      </ScrollView>
    </View>
  );
}
