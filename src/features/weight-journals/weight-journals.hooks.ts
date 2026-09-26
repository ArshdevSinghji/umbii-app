import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createWeightJournalAction } from "./create-weight-journal/create-weight-journal.action";
import { deleteWeightJournalAction } from "./delete-weight-journal/delete-weight-journal.action";
import { getWeightJournalAction } from "./get-weight-journal/get-weight-journal.action";
import { listWeightJournalsAction } from "./list-weight-journals/list-weight-journals.action";
import { updateWeightJournalAction } from "./update-weight-journal/update-weight-journal.action";

export function useWeightJournalsActionsHook() {
  const dispatch = useAppDispatch();
  const { listWeightJournals, selectedWeightJournal, isLoading } = useAppSelector(
    (state) => state.weightJournalsSlice,
  );

  const fetchWeightJournals = async (userId: number) => {
    await dispatch(listWeightJournalsAction({ userId })).unwrap();
  };

  const createWeightJournal = async (userId: number, currentWeight: string, targetWeight: string) => {
    await dispatch(createWeightJournalAction({ userId, currentWeight, targetWeight })).unwrap();
  };

  const fetchWeightJournalById = async (userId: number, weightJournalId: number) => {
    await dispatch(getWeightJournalAction({ userId, weightJournalId })).unwrap();
  };

  const updateWeightJournal = async (
    userId: number,
    weightJournalId: number,
    currentWeight: string,
    targetWeight: string,
  ) => {
    await dispatch(updateWeightJournalAction({ userId, weightJournalId, currentWeight, targetWeight })).unwrap();
  };

  const deleteWeightJournal = async (userId: number, weightJournalId: number) => {
    await dispatch(deleteWeightJournalAction({ userId, weightJournalId })).unwrap();
  };

  return {
    isLoading,
    listWeightJournals,
    selectedWeightJournal,
    fetchWeightJournals,
    createWeightJournal,
    fetchWeightJournalById,
    updateWeightJournal,
    deleteWeightJournal,
  };
}
