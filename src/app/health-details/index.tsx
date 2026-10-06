import HealthDetails from "@/components/health-details";
import { healthDetailsModeSchema } from "@/components/health-details/health-details.schema";
import { Stack, useLocalSearchParams } from "expo-router";

export default function HealthDetailsScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = healthDetailsModeSchema.parse(params.mode);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HealthDetails mode={mode} />
    </>
  );
}
