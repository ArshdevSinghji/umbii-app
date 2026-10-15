import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { useAppSelector } from "@/store/hooks";
import {
  HealthDetailsMode,
  HealthDetailsValues,
} from "../health-details.schema";

const toApiWeight = (weight: number) => weight.toFixed(1);

export function useSaveHealthDetails(mode: HealthDetailsMode) {
  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isSaving: isSavingWeight,
    latestWeightJournal,
    createWeightJournal,
    updateWeightJournal,
  } = useWeightJournalsActionsHook();
  const { isUpdating: isSavingHeight, updateHeight } = useUserActionsHook();

  // All-time latest entry: the form's starting values and the goal kept when
  // only the weight changes, right even after a week without entries.
  const latest = latestWeightJournal;

  const save = async ({
    currentWeight,
    targetWeight,
    height,
  }: HealthDetailsValues) => {
    if (mode === "height") {
      await updateHeight(height);
      return;
    }

    // Writes today's weight entry. POST is an upsert (one entry per day): the
    // first save of the day creates it, later ones replace it. Safe to repeat,
    // so a retry after a partial failure can't duplicate it.
    const saveTodaysWeight = (weight: string, target: string) =>
      createWeightJournal(user.id, weight, target);

    // First entry: weight and height go out together. Height is a PUT, so
    // resending it on retry is harmless too.
    if (mode === "start" || !latest) {
      await Promise.all([
        saveTodaysWeight(toApiWeight(currentWeight), toApiWeight(targetWeight)),
        updateHeight(height),
      ]);
      return;
    }

    if (mode === "goal") {
      await updateWeightJournal(
        user.id,
        latest.id,
        latest.currentWeight,
        toApiWeight(targetWeight),
      );
      return;
    }

    // Weight: keep the current goal.
    await saveTodaysWeight(toApiWeight(currentWeight), latest.targetWeight);
  };

  return { latest, isSaving: isSavingWeight || isSavingHeight, save };
}
