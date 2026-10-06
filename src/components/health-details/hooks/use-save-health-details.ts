import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { isLoggedToday } from "@/features/weight-journals/weight-journals.utils";
import { useAppSelector } from "@/store/hooks";
import { HealthDetailsMode, HealthDetailsValues } from "../health-details.schema";

const toApiWeight = (weight: number) => weight.toFixed(1);

export function useSaveHealthDetails(mode: HealthDetailsMode) {
  const { user } = useAppSelector((state) => state.userSlice);
  const { isSaving, listWeightJournals, createWeightJournal, updateWeightJournal } =
    useWeightJournalsActionsHook();

  // API returns newest first.
  const latest = listWeightJournals[0] ?? null;

  const save = async ({ currentWeight, targetWeight }: HealthDetailsValues) => {
    // TODO: send `height` once the backend stores it.

    if (mode === "start" || !latest) {
      await createWeightJournal(user.id, toApiWeight(currentWeight), toApiWeight(targetWeight));
      return;
    }

    if (mode === "goal") {
      await updateWeightJournal(user.id, latest.id, latest.currentWeight, toApiWeight(targetWeight));
      return;
    }

    // Weight: correct today's entry, otherwise log a new one with the same goal.
    if (isLoggedToday(latest)) {
      await updateWeightJournal(user.id, latest.id, toApiWeight(currentWeight), latest.targetWeight);
    } else {
      await createWeightJournal(user.id, toApiWeight(currentWeight), latest.targetWeight);
    }
  };

  return { latest, isSaving, save };
}
