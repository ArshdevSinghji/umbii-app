import { HealthDetailsMode } from "@/components/health-details/health-details.schema";
import { useUserActionsHook } from "@/features/user/user.hook";
import { GoalType } from "@/features/user/user.types";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { getWeightPeriodRange } from "@/features/weight-journals/weight-journals.utils";
import { useAppSelector } from "@/store/hooks";
import { ErrorState } from "@/components/ui/error-state";
import { reportRequestError } from "@/lib/http-client";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import BmiCard from "./bmi-card";
import WeightEmptyState from "./empty-state";
import StatsHeader from "./header";
import GoalProgressSkeleton from "./loading";
import WeightCard from "./weight-card";
import WeightChart from "./weight-chart";

export default function GoalProgress() {
  const { user } = useAppSelector((state) => state.userSlice);
  const {
    latestWeightJournal: latest,
    latestStatus,
    chartWeightJournals,
    chartStatus,
    fetchLatestWeightJournal,
    fetchWeightChart,
  } = useWeightJournalsActionsHook();
  // Goal weight and height live on the profile (saved by onboarding).
  const { profile, profileStatus, fetchUser } = useUserActionsHook();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  // Each loads on its own. The latest entry (current weight, goal) decides
  // what the page shows; the chart fills in independently and can fail
  // without taking the page down.
  const loadLatest = () =>
    Promise.all([fetchLatestWeightJournal(user.id), fetchUser(user.id)]).catch(
      (error) => reportRequestError("Error fetching weight or profile:", error),
    );
  const loadChart = () =>
    fetchWeightChart(user.id, getWeightPeriodRange("week")).catch((error) =>
      reportRequestError("Error fetching weight chart:", error),
    );

  useEffect(() => {
    if (!user.id) return;
    // In parallel: the chart doesn't wait for the latest entry.
    loadLatest();
    loadChart();
  }, [user.id]);

  // Pull-to-refresh: both, rejecting on failure so the toast can show.
  useRefresh(() =>
    Promise.all([
      fetchLatestWeightJournal(user.id),
      fetchUser(user.id),
      fetchWeightChart(user.id, getWeightPeriodRange("week")),
    ]),
  );

  const handleRetryLatest = async () => {
    setIsRetrying(true);
    await loadLatest();
    setIsRetrying(false);
  };

  const openHealthDetails = (mode: HealthDetailsMode) =>
    router.push({ pathname: "/health-details", params: { mode } });

  const isLoading = (status: typeof latestStatus) =>
    status === "idle" || status === "loading";

  const renderContent = () => {
    if (isLoading(latestStatus) || isLoading(profileStatus)) {
      // After onboarding there's always a height, so the BMI card shows.
      return <GoalProgressSkeleton hasHeight />;
    }

    // Not the empty state: "Get started" would create a duplicate first entry.
    if (latestStatus === "error" || profileStatus === "error") {
      return (
        <ErrorState
          title="Couldn't load your weight data"
          onRetry={handleRetryLatest}
          isRetrying={isRetrying}
        />
      );
    }

    // Onboarding records the first weigh-in and the goal, so that's where
    // "Get started" goes.
    if (!latest || !profile) {
      return (
        <WeightEmptyState onGetStarted={() => router.push("/onboarding")} />
      );
    }

    const isMaintaining = profile.goalType === GoalType.Maintenance;

    // Changing goal weight or height regenerates the plan; the edit screen
    // asks first. Maintenance has no goal weight to change.
    return (
      <View className="gap-3">
        <WeightCard
          weight={profile.targetWeightKg ?? latest.weightKg}
          label={isMaintaining ? "Goal: maintain" : "Goal weight"}
          {...(!isMaintaining && {
            actionLabel: "Update my goal",
            onActionPress: () => openHealthDetails("goal"),
          })}
        />
        <WeightCard
          weight={latest.weightKg}
          label="Current weight"
          actionLabel="Update weight"
          onActionPress={() => openHealthDetails("weight")}
        />
        <WeightChart
          entries={chartWeightJournals}
          status={chartStatus}
          onRetry={loadChart}
          latest={latest}
          targetWeightKg={profile.targetWeightKg}
        />
        <BmiCard
          weight={latest.weightKg}
          height={profile.heightCm}
          onUpdateHeight={() => openHealthDetails("height")}
        />
      </View>
    );
  };

  return (
    <View>
      <StatsHeader />
      {renderContent()}
    </View>
  );
}
