import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { isLoggedToday } from "@/features/weight-journals/weight-journals.utils";
import { useAppSelector } from "@/store/hooks";
import { HealthDetailsMode, HealthDetailsValues } from "../health-details.schema";

const toApiWeight = (weight: number) => weight.toFixed(1);

export function useSaveHealthDetails(mode: HealthDetailsMode) {
  const { user } = useAppSelector((state) => state.userSlice);
  const { isSaving: isSavingWeight, listWeightJournals, createWeightJournal, updateWeightJournal } =
    useWeightJournalsActionsHook();
  const { isUpdating: isSavingHeight, updateHeight } = useUserActionsHook();

  // API returns newest first.
  const latest = listWeightJournals[0] ?? null;

  const save = async ({ currentWeight, targetWeight, height }: HealthDetailsValues) => {
    if (mode === "height") {
      await updateHeight(height);
      return;
    }

    // Writes today's weight entry: updates it if one exists, otherwise creates
    // one. Safe to repeat, so a retry after a partial failure can't duplicate it.
    const saveTodaysWeight = (weight: string, target: string) =>
      latest && isLoggedToday(latest)
        ? updateWeightJournal(user.id, latest.id, weight, target)
        : createWeightJournal(user.id, weight, target);

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
      await updateWeightJournal(user.id, latest.id, latest.currentWeight, toApiWeight(targetWeight));
      return;
    }

    // Weight: keep the current goal.
    await saveTodaysWeight(toApiWeight(currentWeight), latest.targetWeight);
  };

  return { latest, isSaving: isSavingWeight || isSavingHeight, save };
}
