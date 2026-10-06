import { DUMMY_HEIGHT_CM } from "@/components/stats/dummy-data";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HealthDetailsHeader from "./header";
import {
  HealthDetailsField,
  HealthDetailsMode,
  HealthDetailsValues,
  MODE_FIELDS,
  WEIGHT_RANGE,
  getHealthDetailsSchema,
} from "./health-details.schema";
import { useSaveHealthDetails } from "./hooks/use-save-health-details";
import HeightField from "./height-field";
import MeasurementField from "./measurement-field";

const DEFAULT_WEIGHT = 70;

const COPY: Record<HealthDetailsMode, { title: string; description: string }> = {
  start: {
    title: "Start tracking your weight",
    description: "Tell us your current weight, the weight you're aiming for, and your height.",
  },
  weight: {
    title: "Update your weight",
    description: "Slide to what you weigh today.",
  },
  goal: {
    title: "Set your goal weight",
    description: "Slide to the weight you're aiming for.",
  },
};

// Height has its own field (cm / ft toggle).
const FIELDS: Record<
  Exclude<HealthDetailsField, "height">,
  { label: string; unit: string; range: typeof WEIGHT_RANGE }
> = {
  currentWeight: { label: "Current weight", unit: "kg", range: WEIGHT_RANGE },
  targetWeight: { label: "Goal weight", unit: "kg", range: WEIGHT_RANGE },
};

interface IProps {
  mode: HealthDetailsMode;
}

export default function HealthDetails({ mode }: IProps) {
  const router = useRouter();
  const { latest, isSaving, save } = useSaveHealthDetails(mode);

  const [values, setValues] = useState<HealthDetailsValues>(() => ({
    currentWeight: latest ? parseFloat(latest.currentWeight) : DEFAULT_WEIGHT,
    targetWeight: latest ? parseFloat(latest.targetWeight) : DEFAULT_WEIGHT,
    height: DUMMY_HEIGHT_CM,
  }));
  const [errors, setErrors] = useState<Partial<Record<HealthDetailsField, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Block back gestures / hardware back until the request resolves.
  usePreventRemove(isSaving && !isDone, () => {});

  useEffect(() => {
    if (isDone) router.back();
  }, [isDone, router]);

  const handleChange = (field: HealthDetailsField) => (value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSave = async () => {
    const result = getHealthDetailsSchema(mode).safeParse(values);

    if (!result.success) {
      const fieldErrors: Partial<Record<HealthDetailsField, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as HealthDetailsField] ??= issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await save(values);
      setIsDone(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <HealthDetailsHeader
          title={COPY[mode].title}
          description={COPY[mode].description}
          onBack={() => router.back()}
          disabled={isSaving}
        />

        {MODE_FIELDS[mode].map((field) =>
          field === "height" ? (
            <HeightField
              key={field}
              value={values.height}
              onChange={handleChange("height")}
              error={errors.height}
            />
          ) : (
            <MeasurementField
              key={field}
              {...FIELDS[field]}
              value={values[field]}
              onChange={handleChange(field)}
              error={errors[field]}
            />
          ),
        )}
      </ScrollView>

      <View className="gap-2 px-4 pb-4 pt-2">
        {submitError && (
          <Text className="text-center text-sm text-destructive">{submitError}</Text>
        )}
        <Button className="h-12 rounded-full" onPress={handleSave} disabled={isSaving}>
          <Loading isLoading={isSaving} text="Save" />
        </Button>
      </View>
    </SafeAreaView>
  );
}
