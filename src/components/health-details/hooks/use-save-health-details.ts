import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { useAppSelector } from "@/store/hooks";
import {
  HealthDetailsMode,
  HealthDetailsValues,
} from "../health-details.schema";

// Only today's weight can be saved for now. Goal weight and height live on
// the profile, which has no update endpoint yet (only redoing onboarding
// replaces it), so those modes aren't linked from anywhere.
export function useSaveHealthDetails(mode: HealthDetailsMode) {
  const { user } = useAppSelector((state) => state.userSlice);
  const { isSaving, latestWeightJournal, createWeightJournal } =
    useWeightJournalsActionsHook();
  const { profile } = useUserActionsHook();

  const save = async ({ currentWeight }: HealthDetailsValues) => {
    if (mode !== "weight") {
      throw new Error("This can't be changed here yet.");
    }
    // POST is an upsert for today (one entry per day): the first save
    // creates it, later ones replace it. Safe to repeat.
    await createWeightJournal(user.id, Number(currentWeight.toFixed(1)));
  };

  return { latest: latestWeightJournal, profile, isSaving, save };
}
