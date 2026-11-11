import MeasurementField from "@/components/health-details/measurement-field";
import {
  HEIGHT_RANGE,
  WEIGHT_RANGE,
} from "@/components/health-details/health-details.schema";
import GoalStep from "@/components/onboarding/goal-step";
import {
  GoalType,
} from "@/components/onboarding/onboarding.types";
import { getTargetWeightRange } from "@/components/onboarding/onboarding.utils";
import ActivityPicker from "@/components/profile-fields/activity-picker";
import DateOfBirthField from "@/components/profile-fields/date-of-birth-field";
import DietPicker from "@/components/profile-fields/diet-picker";
import HealthFlagsPicker from "@/components/profile-fields/health-flags-picker";
import PacePicker from "@/components/profile-fields/pace-picker";
import TargetMarginNote from "@/components/profile-fields/target-margin-note";
import SessionLengthPicker from "@/components/profile-fields/session-length-picker";
import SexPicker from "@/components/profile-fields/sex-picker";
import TrainingTypePicker from "@/components/profile-fields/training-type-picker";
import WorkoutsPicker from "@/components/profile-fields/workouts-picker";
import { ActionButton } from "@/components/ui/action-button";
import { SheetHandle } from "@/components/ui/sheet-handle";
import { Text } from "@/components/ui/text";
import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { getErrorMessage, isUnauthorizedError } from "@/lib/http-client";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { X } from "phosphor-react-native/src/icons/X";
import { ReactNode, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DetailField,
  getMissing,
  PlanDraft,
  getTargetWeight,
  isSameChange,
  needsTraining,
  toDraft,
  toProfileChanges,
} from "./detail-sheet.utils";

const DEFAULT_WEIGHT = 70;

const TITLES: Record<DetailField, string> = {
  goal: "Your goal",
  targetWeight: "Target weight",
  pace: "Pace",
  weight: "Weight",
  height: "Height",
  sex: "Sex",
  dateOfBirth: "Date of birth",
  workouts: "Workouts per week",
  trainingType: "Main training type",
  session: "Average session length",
  activity: "The rest of your day",
  diet: "Diet type",
  health: "Health",
};

interface IProps {
  field: DetailField;
  visible: boolean;
  onClose: () => void;
}

// A bottom sheet for one row of "Your details": its own picker, filled in
// from what's saved, and Save. Profile answers PATCH /profile, which
// regenerates the nutrition target from today; weight is today's weigh-in.
// Mounted per opening, so the draft starts from what's saved.
export default function DetailSheet({ field, visible, onClose }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { user, profile, isPatchingProfile, patchUserProfile } =
    useUserActionsHook();
  const {
    latestWeightJournal,
    isSaving: isSavingWeight,
    createWeightJournal,
  } = useWeightJournalsActionsHook();
  const isSaving = isPatchingProfile || isSavingWeight;

  const latestWeight =
    latestWeightJournal?.weightKg ?? profile?.targetWeightKg ?? DEFAULT_WEIGHT;
  const [draft, setDraft] = useState<PlanDraft | null>(() =>
    profile ? toDraft(profile, latestWeight) : null,
  );
  const [error, setError] = useState<string | null>(null);

  // Only opened from the plan page, which needs a profile.
  if (!profile || !draft) return null;
  const saved = toDraft(profile, latestWeight);

  const set = <K extends keyof PlanDraft>(
    key: K,
    value: PlanDraft[K],
  ) => {
    setDraft((prev) => prev && { ...prev, [key]: value });
    setError(null);
  };

  // A different goal needs its own target and pace (the rates differ, and
  // the target's direction flips), so those start over; back to the saved
  // goal brings the saved ones back.
  const setGoal = (goalType: GoalType) => {
    const isSaved = goalType === profile.goalType;
    setDraft(
      (prev) =>
        prev && {
          ...prev,
          goalType,
          targetWeightKg: isSaved ? saved.targetWeightKg : null,
          pace: isSaved ? saved.pace : null,
        },
    );
    setError(null);
  };

  const missing = getMissing(field, draft);
  const hasChanges =
    !missing &&
    (field === "weight"
      ? draft.weightKg !== latestWeightJournal?.weightKg
      : !isSameChange(
          toProfileChanges(field, draft),
          toProfileChanges(field, saved),
        ));

  const close = () => {
    if (!isSaving) onClose();
  };

  const save = async () => {
    setError(null);
    try {
      if (field === "weight") {
        // POST is an upsert for today (one entry per day).
        await createWeightJournal(user.id, Number(draft.weightKg.toFixed(1)));
      } else {
        await patchUserProfile(user.id, toProfileChanges(field, draft));
      }
      onClose();
    } catch (err) {
      // 401 is already handled by sending the user to sign in.
      if (!isUnauthorizedError(err)) setError(getErrorMessage(err));
    }
  };

  // Fat loss or muscle gain: the goals with a target and pace.
  const goalType =
    draft.goalType !== GoalType.Maintenance ? draft.goalType : null;
  const targetRange = getTargetWeightRange(
    draft.weightKg,
    draft.goalType ?? undefined,
  );

  const content: Record<DetailField, ReactNode> = {
    goal: (
      <View className="gap-6">
        <GoalStep goalType={draft.goalType} onChange={setGoal} />
        {/* A new goal (other than maintaining) needs a target and pace. */}
        {goalType && goalType !== profile.goalType && (
          <>
            {/* The ruler reads its value on mount; a new goal has a new
                range, so a new ruler. */}
            <MeasurementField
              key={goalType}
              label="Target weight"
              unit="kg"
              range={targetRange}
              value={getTargetWeight(draft)}
              onChange={(kg) => set("targetWeightKg", kg)}
            />
            <TargetMarginNote goalType={goalType} weightKg={draft.weightKg} />
            <View className="gap-2">
              <Text className="text-sm text-muted-foreground">Pace</Text>
              <PacePicker
                goalType={goalType}
                value={draft.pace}
                onChange={(pace) => set("pace", pace)}
              />
            </View>
          </>
        )}
      </View>
    ),
    targetWeight: (
      <View className="gap-4">
        <MeasurementField
          label="Target weight"
          unit="kg"
          hint={`${targetRange.min} to ${targetRange.max} kg`}
          range={targetRange}
          value={getTargetWeight(draft)}
          onChange={(kg) => set("targetWeightKg", kg)}
        />
        {goalType && (
          <TargetMarginNote goalType={goalType} weightKg={draft.weightKg} />
        )}
      </View>
    ),
    pace: goalType && (
      <PacePicker
        goalType={goalType}
        value={draft.pace}
        onChange={(pace) => set("pace", pace)}
      />
    ),
    weight: (
      <MeasurementField
        label="Today's weight"
        unit="kg"
        range={WEIGHT_RANGE}
        value={draft.weightKg}
        onChange={(kg) => set("weightKg", kg)}
      />
    ),
    height: (
      <MeasurementField
        label="Height"
        unit="cm"
        range={HEIGHT_RANGE}
        value={draft.heightCm}
        onChange={(cm) => set("heightCm", cm)}
      />
    ),
    sex: <SexPicker value={draft.sex} onChange={(sex) => set("sex", sex)} />,
    dateOfBirth: (
      <DateOfBirthField
        value={draft.dateOfBirth}
        onChange={(date) => set("dateOfBirth", date)}
      />
    ),
    workouts: (
      <View className="gap-6">
        <View className="gap-2">
          <WorkoutsPicker
            value={draft.workoutsPerWeek}
            onChange={(count) => set("workoutsPerWeek", count)}
          />
          <Text className="text-xs text-muted-foreground">
            Any training counts: gym, running, sport, yoga.
          </Text>
        </View>
        {/* Starting to train: what and how long, which aren't saved yet. */}
        {needsTraining(draft) && !needsTraining(saved) && (
          <>
            <View className="gap-2">
              <Text className="text-sm text-muted-foreground">
                Main training type
              </Text>
              <TrainingTypePicker
                value={draft.trainingType}
                onChange={(type) => set("trainingType", type)}
              />
            </View>
            <View className="gap-2">
              <Text className="text-sm text-muted-foreground">
                Average session length (min)
              </Text>
              <SessionLengthPicker
                value={draft.avgSessionMinutes}
                onChange={(minutes) => set("avgSessionMinutes", minutes)}
              />
            </View>
          </>
        )}
      </View>
    ),
    trainingType: (
      <TrainingTypePicker
        value={draft.trainingType}
        onChange={(type) => set("trainingType", type)}
      />
    ),
    session: (
      <SessionLengthPicker
        value={draft.avgSessionMinutes}
        onChange={(minutes) => set("avgSessionMinutes", minutes)}
      />
    ),
    activity: (
      <ActivityPicker
        value={draft.activityLevel}
        onChange={(level) => set("activityLevel", level)}
      />
    ),
    diet: (
      <DietPicker
        value={draft.dietType}
        onChange={(dietType) => set("dietType", dietType)}
      />
    ),
    health: (
      <HealthFlagsPicker
        value={draft.healthFlags}
        onChange={(flags) => set("healthFlags", flags)}
      />
    ),
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      // Modals are their own native window on Android: draw behind the
      // system bars (edge-to-edge).
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <Pressable className="flex-1" onPress={close} />

        {/* Sized to its content, up to most of the screen. Side padding
            matches the pages, which the ruler is laid out for. */}
        <View
          className="max-h-[85%] gap-4 rounded-t-3xl bg-background px-4 pt-6"
          style={{ paddingBottom: 16 + insets.bottom }}
        >
          <SheetHandle />
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-lg">{TITLES[field]}</Text>
            <Pressable
              onPress={close}
              hitSlop={8}
              className="rounded-full bg-muted p-1.5"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={16} color={theme.foreground} />
            </Pressable>
          </View>

          <ScrollView
            className="grow-0"
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {content[field]}
            <Text className="text-xs text-muted-foreground">
              {field === "weight"
                ? "Saved as today's weigh-in. Your targets update when your weight moves 1 kg or more from the one they were worked out with."
                : "Saving recalculates your daily targets from today."}
            </Text>
          </ScrollView>

          <View className="gap-2">
            {(error || missing) && (
              <Text
                className={
                  error
                    ? "text-center text-xs text-destructive"
                    : "text-center text-xs text-muted-foreground"
                }
              >
                {error ?? missing}
              </Text>
            )}
            <ActionButton
              label="Save"
              onPress={save}
              disabled={!hasChanges}
              isLoading={isSaving}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
