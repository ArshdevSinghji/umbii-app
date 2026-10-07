import { HealthDetailsMode } from "@/components/health-details/health-details.schema";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { getWeightPeriodRange } from "@/features/weight-journals/weight-journals.utils";
import { useAppSelector } from "@/store/hooks";
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
  const { listWeightJournals, fetchWeightJournals } = useWeightJournalsActionsHook();
  const router = useRouter();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!user.id) return;

    const { startDate, endDate } = getWeightPeriodRange("week");
    fetchWeightJournals(user.id, { startDate, endDate })
      .catch((error) => console.error("Error fetching weight journals:", error))
      .finally(() => setIsInitialLoad(false));
  }, [user.id]);

  // API returns newest first, so the latest entry is always at the top.
  const latest = listWeightJournals[0] ?? null;

  const handleMenuPress = () => {
    // TODO: open goal progress options menu.
  };

  const openHealthDetails = (mode: HealthDetailsMode) =>
    router.push({ pathname: "/health-details", params: { mode } });

  const renderContent = () => {
    if (isInitialLoad) return <GoalProgressSkeleton />;

    if (!latest) {
      return <WeightEmptyState onGetStarted={() => openHealthDetails("start")} />;
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
        <WeightChart journals={listWeightJournals} />
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
      <StatsHeader onMenuPress={handleMenuPress} />
      {renderContent()}
    </View>
  );
}
