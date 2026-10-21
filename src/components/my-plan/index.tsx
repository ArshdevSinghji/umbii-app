import { getAge } from "@/components/onboarding/onboarding.utils";
import {
  ACTIVITY_LABELS,
  ALLERGY_LABELS,
  DIET_LABELS,
  GOAL_LABELS,
  HEALTH_LABELS,
  TRAINING_LABELS,
  getSessionLabel,
} from "@/components/plan-targets/profile-labels";
import TargetBreakdown from "@/components/plan-targets/target-breakdown";
import TargetsOverview from "@/components/plan-targets/targets-overview";
import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { errorToast } from "@/components/ui/app-toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { isGeneratedTarget } from "@/features/nutrition-target/nutrition-target.utils";
import { useUserActionsHook } from "@/features/user/user.hook";
import { GoalType } from "@/features/user/user.types";
import {
  getErrorMessage,
  isUnauthorizedError,
  reportRequestError,
} from "@/lib/http-client";
import { useRouter } from "expo-router";
import { ArrowsClockwise } from "phosphor-react-native/src/icons/ArrowsClockwise";
import { ClipboardText } from "phosphor-react-native/src/icons/ClipboardText";
import { useEffect } from "react";
import { View } from "react-native";

// Your plan: today's targets, how they were worked out (for a generated
// target; a manual one has only the numbers), every
// answer they're based on, and the ways to change them.
export default function MyPlan() {
  const router = useRouter();
  const { user, profile, profileStatus, fetchUser } = useUserActionsHook();
  const {
    nutritionTarget,
    fetchNutritionTarget,
    isGenerating,
    generateNutritionTarget,
  } = useNutritionTargetActionsHook();

  // Fresh on every open: the target in effect today (with how it was
  // worked out, if it was generated), and the profile if not loaded yet.
  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(user.id).catch((error) =>
      reportRequestError("Error fetching target:", error),
    );
    if (profileStatus !== "ready") {
      fetchUser(user.id).catch((error) =>
        reportRequestError("Error fetching profile:", error),
      );
    }
    // On open only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const recalculate = async () => {
    try {
      await generateNutritionTarget(user.id);
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        errorToast("Couldn't recalculate your plan", {
          description: getErrorMessage(error),
        });
      }
    }
  };

  const isMaintaining = profile?.goalType === GoalType.Maintenance;
  const trains = (profile?.workoutsPerWeek ?? 0) > 0;
  // "-0.5 kg/week", signed for loss.
  const pace =
    profile?.weeklyRateKg != null
      ? `${profile.weeklyRateKg > 0 ? "+" : ""}${profile.weeklyRateKg} kg/week`
      : null;

  return (
    <View>
      <PageHeader title="Your plan" onBack={() => router.back()} />

      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <View className="gap-2">
          <Text className="px-1 text-xs text-muted-foreground">
            Daily targets
          </Text>
          {nutritionTarget ? (
            <TargetsOverview target={nutritionTarget} />
          ) : (
            <Skeleton className="h-64 w-full rounded-2xl" />
          )}
        </View>

        {isGeneratedTarget(nutritionTarget) && (
          <View className="gap-2">
            <Text className="px-1 text-xs text-muted-foreground">
              How it was worked out
            </Text>
            <TargetBreakdown target={nutritionTarget} />
          </View>
        )}

        {profile && (
          <SettingsGroup title="Your details">
            <SettingsRow label="Goal" value={GOAL_LABELS[profile.goalType]} />
            {!isMaintaining && profile.targetWeightKg != null && (
              <SettingsRow
                label="Target weight"
                value={`${profile.targetWeightKg} kg`}
                // Editing asks first: it recalculates the plan.
                onPress={() =>
                  router.push({
                    pathname: "/health-details",
                    params: { mode: "goal" },
                  })
                }
              />
            )}
            {pace && <SettingsRow label="Pace" value={pace} />}
            <SettingsRow
              label="Height"
              value={`${profile.heightCm} cm`}
              onPress={() =>
                router.push({
                  pathname: "/health-details",
                  params: { mode: "height" },
                })
              }
            />
            <SettingsRow label="Age" value={`${getAge(profile.dateOfBirth)}`} />
            <SettingsRow
              label="Workouts per week"
              value={`${profile.workoutsPerWeek}`}
            />
            {trains && profile.trainingType && (
              <SettingsRow
                label="Training"
                value={TRAINING_LABELS[profile.trainingType]}
              />
            )}
            {trains && profile.avgSessionMinutes != null && (
              <SettingsRow
                label="Session length"
                value={getSessionLabel(profile.avgSessionMinutes)}
              />
            )}
            <SettingsRow
              label="Rest of your day"
              value={ACTIVITY_LABELS[profile.activityLevel]}
            />
            <SettingsRow label="Diet" value={DIET_LABELS[profile.dietType]} />
            <SettingsRow
              label="Allergies"
              value={
                profile.allergies.length > 0
                  ? profile.allergies.map((a) => ALLERGY_LABELS[a]).join(", ")
                  : "None"
              }
            />
            <SettingsRow
              label="Health"
              value={
                profile.healthFlags.length > 0
                  ? profile.healthFlags.map((f) => HEALTH_LABELS[f]).join(", ")
                  : "None"
              }
            />
          </SettingsGroup>
        )}

        <SettingsGroup>
          <SettingsRow
            icon={ArrowsClockwise}
            label="Recalculate my plan"
            onPress={recalculate}
            isLoading={isGenerating}
          />
          <SettingsRow
            icon={ClipboardText}
            label="Redo onboarding"
            onPress={() => router.push("/onboarding")}
          />
        </SettingsGroup>

        <Text className="text-center text-xs text-muted-foreground">
          As your weight changes, recalculate your plan to keep it current.
        </Text>
      </View>
    </View>
  );
}
