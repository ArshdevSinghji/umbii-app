import { useUserActionsHook } from "@/features/user/user.hook";
import { useWeightJournalsActionsHook } from "@/features/weight-journals/weight-journals.hooks";
import { useAppSelector } from "@/store/hooks";
import {
  HealthDetailsMode,
  HealthDetailsValues,
} from "../health-details.schema";

const toOneDecimal = (value: number) => Number(value.toFixed(1));

// Saves what the mode edits: today's weigh-in, or the profile's goal weight
// or height (PATCH, which also regenerates the nutrition target, so the
// form asks first).
export function useSaveHealthDetails(mode: HealthDetailsMode) {
  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isSaving: isSavingWeight,
    latestWeightJournal,
    createWeightJournal,
  } = useWeightJournalsActionsHook();
  const { profile, isPatchingProfile, patchUserProfile } = useUserActionsHook();

  const save = async ({
    currentWeight,
    targetWeight,
    height,
  }: HealthDetailsValues) => {
    if (mode === "weight") {
      // POST is an upsert for today (one entry per day). Safe to repeat.
      await createWeightJournal(user.id, toOneDecimal(currentWeight));
      return;
    }
    if (mode === "goal") {
      await patchUserProfile(user.id, {
        targetWeightKg: toOneDecimal(targetWeight),
      });
      return;
    }
    if (mode === "height") {
      await patchUserProfile(user.id, { heightCm: Math.round(height) });
      return;
    }
    // "start" is covered by onboarding now.
    throw new Error("This can't be changed here.");
  };

  return {
    latest: latestWeightJournal,
    profile,
    isSaving: isSavingWeight || isPatchingProfile,
    save,
  };
}
