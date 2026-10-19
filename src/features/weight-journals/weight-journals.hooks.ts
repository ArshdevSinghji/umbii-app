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

  // Today's weigh-in (an upsert: a second save today replaces it).
  const createWeightJournal = async (userId: number, weightKg: number) => {
    await dispatch(createWeightJournalAction({ userId, weightKg })).unwrap();
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
