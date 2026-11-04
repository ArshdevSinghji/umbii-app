import { getNutritionTargetAction } from "@/features/nutrition-target/get-nutrition-target/get-nutrition-target.action";
import { reportRequestError } from "@/lib/http-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createWeightJournalAction } from "./create-weight-journal/create-weight-journal.action";
import { deleteWeightJournalAction } from "./delete-weight-journal/delete-weight-journal.action";
import { getWeightJournalAction } from "./get-weight-journal/get-weight-journal.action";
import { getLatestWeightJournalAction } from "./get-latest-weight-journal/get-latest-weight-journal.action";
import { listWeightJournalsAction } from "./list-weight-journals/list-weight-journals.action";
import { updateWeightJournalAction } from "./update-weight-journal/update-weight-journal.action";

export function useWeightJournalsActionsHook() {
  const dispatch = useAppDispatch();
  const {
    latestWeightJournal,
    latestStatus,
    chartWeightJournals,
    chartStatus,
    selectedWeightJournal,
    isSelectedLoading,
    isSaving,
  } = useAppSelector((state) => state.weightJournalsSlice);

  // The user's all-time latest entry (current weight, goal).
  const fetchLatestWeightJournal = async (userId: number) => {
    await dispatch(getLatestWeightJournalAction({ userId })).unwrap();
  };

  // Entries for the chart's date range.
  const fetchWeightChart = async (
    userId: number,
    params: { startDate: string; endDate: string },
  ) => {
    await dispatch(
      listWeightJournalsAction({
        userId,
        params: {
          "dateRange.startDate": params.startDate,
          "dateRange.endDate": params.endDate,
        },
      }),
    ).unwrap();
  };

  // A weigh-in can replace the target: the server regenerates it when the
  // weight moved 1 kg+ from the one it was worked out with, or the goal
  // weight is reached. The response doesn't say, so reload Home's current
  // target. Not awaited: the weigh-in itself is saved either way.
  const refreshTarget = (userId: number) => {
    dispatch(getNutritionTargetAction({ userId, params: {} }))
      .unwrap()
      .catch((error) => reportRequestError("Error refreshing target:", error));
  };

  // Today's weigh-in (an upsert: a second save today replaces it).
  const createWeightJournal = async (userId: number, weightKg: number) => {
    await dispatch(createWeightJournalAction({ userId, weightKg })).unwrap();
    refreshTarget(userId);
  };

  const fetchWeightJournalById = async (
    userId: number,
    weightJournalId: number,
  ) => {
    await dispatch(
      getWeightJournalAction({ userId, weightJournalId }),
    ).unwrap();
  };

  const updateWeightJournal = async (
    userId: number,
    weightJournalId: number,
    weightKg: number,
  ) => {
    await dispatch(
      updateWeightJournalAction({ userId, weightJournalId, weightKg }),
    ).unwrap();
    // Correcting the latest entry can replace the target too.
    if (latestWeightJournal?.id === weightJournalId) refreshTarget(userId);
  };

  const deleteWeightJournal = async (
    userId: number,
    weightJournalId: number,
  ) => {
    await dispatch(
      deleteWeightJournalAction({ userId, weightJournalId }),
    ).unwrap();
    // If it was the latest, the next one may be outside the chart's range;
    // only the server knows, so ask again.
    if (latestWeightJournal?.id === weightJournalId) {
      await fetchLatestWeightJournal(userId);
    }
  };

  return {
    isSaving,
    latestWeightJournal,
    latestStatus,
    chartWeightJournals,
    chartStatus,
    selectedWeightJournal,
    isSelectedLoading,
    fetchLatestWeightJournal,
    fetchWeightChart,
    createWeightJournal,
    fetchWeightJournalById,
    updateWeightJournal,
    deleteWeightJournal,
  };
}
