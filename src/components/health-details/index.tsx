import { getErrorMessage } from "@/lib/http-client";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getTargetWeightRange } from "@/components/onboarding/onboarding.utils";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { View } from "react-native";
import HealthDetailsHeader from "./header";
import {
  HealthDetailsField,
  HealthDetailsMode,
  HealthDetailsValues,
  HEIGHT_RANGE,
  MODE_FIELDS,
  WEIGHT_RANGE,
  getHealthDetailsSchema,
} from "./health-details.schema";
import { useSaveHealthDetails } from "./hooks/use-save-health-details";
import MeasurementField from "./measurement-field";

const DEFAULT_WEIGHT = 70;
const DEFAULT_HEIGHT = 170;

const COPY: Record<HealthDetailsMode, { title: string; description: string }> =
  {
    start: {
      title: "Start tracking your weight",
      description:
        "Tell us your current weight, the weight you're aiming for, and your height.",
    },
    weight: {
      title: "Update your weight",
      description: "Slide to what you weigh today.",
    },
    goal: {
      title: "Set your goal weight",
      description:
        "Slide to the weight you're aiming for. Your plan is recalculated from it.",
    },
    height: {
      title: "Update your height",
      description:
        "We use it for your BMI and your plan, which is recalculated from it.",
    },
  };

// Height has its own field (cm / ft toggle).
const FIELDS: Record<
  HealthDetailsField,
  { label: string; unit: string; range: typeof WEIGHT_RANGE }
> = {
  currentWeight: { label: "Current weight", unit: "kg", range: WEIGHT_RANGE },
  targetWeight: { label: "Goal weight", unit: "kg", range: WEIGHT_RANGE },
  height: { label: "Height", unit: "cm", range: HEIGHT_RANGE },
};

interface IProps {
  mode: HealthDetailsMode;
}

export default function HealthDetailsForm({ mode }: IProps) {
  const router = useRouter();
  const { latest, profile, isSaving, save } = useSaveHealthDetails(mode);

  const [values, setValues] = useState<HealthDetailsValues>(() => ({
    currentWeight: latest?.weightKg ?? DEFAULT_WEIGHT,
    targetWeight: profile?.targetWeightKg ?? latest?.weightKg ?? DEFAULT_WEIGHT,
    height: profile?.heightCm ?? DEFAULT_HEIGHT,
  }));
  const [errors, setErrors] = useState<
    Partial<Record<HealthDetailsField, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  // Goal weight and height regenerate the nutrition target: ask first.
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const recalculatesPlan = mode === "goal" || mode === "height";

  // Goal weight: within -30/+20 kg of the latest weigh-in, as the server
  // allows (it also checks the direction against the goal).
  const fields = {
    ...FIELDS,
    targetWeight: {
      ...FIELDS.targetWeight,
      range: latest ? getTargetWeightRange(latest.weightKg) : WEIGHT_RANGE,
    },
  };

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

    if (recalculatesPlan) {
      setIsConfirmOpen(true);
      return;
    }
    await submit();
  };

  const submit = async () => {
    setSubmitError(null);
    try {
      await save(values);
      setIsDone(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    // Fills the screen so the Save button rests at the bottom on short pages.
    <View className="flex-1 justify-between gap-8">
      <View className="gap-8">
        <HealthDetailsHeader
          title={COPY[mode].title}
          description={COPY[mode].description}
          onBack={() => router.back()}
          disabled={isSaving}
        />

        {MODE_FIELDS[mode].map((field) => (
          <MeasurementField
            key={field}
            {...fields[field]}
            value={values[field]}
            onChange={handleChange(field)}
            error={errors[field]}
          />
        ))}
      </View>

      <View className="gap-2">
        {submitError && (
          <Text className="text-center text-sm text-destructive">
            {submitError}
          </Text>
        )}
        <ActionButton label="Save" onPress={handleSave} isLoading={isSaving} />
        {/* Kept inside the bottom group: as its own child of the page it
            took a slot in justify-between and pushed Save up. */}
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Update your plan?"
          description={`Changing your ${
            mode === "height" ? "height" : "goal weight"
          } recalculates your daily nutrition targets from today, replacing your current ones.`}
          confirmLabel="Update"
          onConfirm={submit}
        />
      </View>
    </View>
  );
}
