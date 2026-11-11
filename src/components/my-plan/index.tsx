import { getAge } from "@/components/onboarding/onboarding.utils";
import {
  ACTIVITY_LABELS,
  ALLERGY_LABELS,
  DIET_LABELS,
  GOAL_LABELS,
  HEALTH_LABELS,
  SEX_LABELS,
  TRAINING_LABELS,
  getSessionLabel,
} from "@/components/plan-targets/profile-labels";
import DetailSheet from "./detail-sheet";
import { DetailField } from "./detail-sheet/detail-sheet.utils";
import TargetBreakdown from "@/components/plan-targets/target-breakdown";
import TargetsOverview from "@/components/plan-targets/targets-overview";
import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { isGeneratedTarget } from "@/features/nutrition-target/nutrition-target.utils";
import { useUserActionsHook } from "@/features/user/user.hook";
import { GoalType } from "@/features/user/user.types";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { reportRequestError } from "@/lib/http-client";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

// Your plan: today's targets, how they were worked out (for a generated
// target; a manual one has only the numbers), every
// answer they're based on, and the ways to change them.
export default function MyPlan() {
  const router = useRouter();
  const { user, profile, profileStatus, fetchUser } = useUserActionsHook();
  const { nutritionTarget, fetchNutritionTarget } =
    useNutritionTargetActionsHook();
  const { latestWeightJournal, fetchLatestWeightJournal } =
    useWeightJournalsActionsHook();

  // Fresh on every open: the target in effect today (with how it was
  // worked out, if it was generated), and the profile if not loaded yet.
  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(user.id).catch((error) =>
      reportRequestError("Error fetching target:", error),
    );
    // For the Weight row (and the goal screen's target weight range).
    if (!latestWeightJournal) {
      fetchLatestWeightJournal(user.id).catch((error) =>
        reportRequestError("Error fetching latest weight:", error),
      );
    }
    if (profileStatus !== "ready") {
      fetchUser(user.id).catch((error) =>
        reportRequestError("Error fetching profile:", error),
      );
    }
    // On open only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // Each detail edits in its own sheet. It's remounted per opening (the
  // key), so its draft starts from what's saved; the field stays set while
  // it slides away.
  const [sheetField, setSheetField] = useState<DetailField | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const edit = (field: DetailField) => {
    setSheetField(field);
    setSheetKey((key) => key + 1);
    setIsSheetOpen(true);
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
            <SettingsRow
              label="Goal"
              value={GOAL_LABELS[profile.goalType]}
              onPress={() => edit("goal")}
            />
            {!isMaintaining && profile.targetWeightKg != null && (
              <SettingsRow
                label="Target weight"
                value={`${profile.targetWeightKg} kg`}
                onPress={() => edit("targetWeight")}
              />
            )}
            {pace && (
              <SettingsRow
                label="Pace"
                value={pace}
                onPress={() => edit("pace")}
              />
            )}
            {latestWeightJournal && (
              <SettingsRow
                label="Weight"
                value={`${latestWeightJournal.weightKg} kg`}
                onPress={() => edit("weight")}
              />
            )}
            <SettingsRow
              label="Height"
              value={`${profile.heightCm} cm`}
              onPress={() => edit("height")}
            />
            <SettingsRow
              label="Sex"
              value={SEX_LABELS[profile.sex]}
              onPress={() => edit("sex")}
            />
            <SettingsRow
              label="Age"
              value={`${getAge(profile.dateOfBirth)}`}
              onPress={() => edit("dateOfBirth")}
            />
            <SettingsRow
              label="Workouts per week"
              value={`${profile.workoutsPerWeek}`}
              onPress={() => edit("workouts")}
            />
            {trains && profile.trainingType && (
              <SettingsRow
                label="Training"
                value={TRAINING_LABELS[profile.trainingType]}
                onPress={() => edit("trainingType")}
              />
            )}
            {trains && profile.avgSessionMinutes != null && (
              <SettingsRow
                label="Session length"
                value={getSessionLabel(profile.avgSessionMinutes)}
                onPress={() => edit("session")}
              />
            )}
            <SettingsRow
              label="Rest of your day"
              value={ACTIVITY_LABELS[profile.activityLevel]}
              onPress={() => edit("activity")}
            />
            <SettingsRow
              label="Diet"
              value={profile.dietType ? DIET_LABELS[profile.dietType] : "Not set"}
              onPress={() => edit("diet")}
            />
            <SettingsRow
              label="Health"
              value={
                profile.healthFlags.length > 0
                  ? profile.healthFlags.map((f) => HEALTH_LABELS[f]).join(", ")
                  : "None"
              }
              onPress={() => edit("health")}
            />
            {/* Onboarding no longer asks, and PATCH /profile can't change
                them: shown read-only, only for accounts that have some. */}
            {profile.allergies && profile.allergies.length > 0 && (
              <SettingsRow
                label="Allergies"
                value={profile.allergies
                  .map((a) => ALLERGY_LABELS[a])
                  .join(", ")}
              />
            )}
          </SettingsGroup>
        )}

        <Text className="text-center text-xs text-muted-foreground">
          Your targets update on their own when a weigh-in moves 1 kg or more
          from the weight they were worked out with.
        </Text>
      </View>

      {sheetField && (
        <DetailSheet
          key={sheetKey}
          field={sheetField}
          visible={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </View>
  );
}
