import { HealthDetailsMode } from "@/components/health-details/health-details.schema";
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
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  // Each loads on its own. The latest entry (current weight, goal) decides
  // what the page shows; the chart fills in independently and can fail
  // without taking the page down.
  const loadLatest = () =>
    fetchLatestWeightJournal(user.id).catch((error) =>
      reportRequestError("Error fetching latest weight:", error),
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

  const renderContent = () => {
    if (latestStatus === "idle" || latestStatus === "loading") {
      return <GoalProgressSkeleton hasHeight={!!user.height} />;
    }

    // Not the empty state: "Get started" would create a duplicate first entry.
    if (latestStatus === "error") {
      return (
        <ErrorState
          title="Couldn't load your weight data"
          onRetry={handleRetryLatest}
          isRetrying={isRetrying}
        />
      );
    }

    if (!latest) {
      return (
        <WeightEmptyState onGetStarted={() => openHealthDetails("start")} />
      );
    }

    return (
      <View className="gap-3">
        <WeightCard
          weight={parseFloat(latest.targetWeight)}
          label="Goal weight"
          actionLabel="Update my goal"
          onActionPress={() => openHealthDetails("goal")}
        />
        <WeightCard
          weight={parseFloat(latest.currentWeight)}
          label="Current weight"
          actionLabel="Update weight"
          onActionPress={() => openHealthDetails("weight")}
        />
        <WeightChart
          entries={chartWeightJournals}
          status={chartStatus}
          onRetry={loadChart}
          latest={latest}
        />
        <BmiCard
          weight={parseFloat(latest.currentWeight)}
          height={user.height ?? null}
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
