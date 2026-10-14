import { useSignOut } from "@/components/home/hooks/use-sign-out";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import {
  getErrorMessage,
  getErrorStatus,
  isUnauthorizedError,
  reportRequestError,
} from "@/lib/http-client";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { errorToast } from "@/components/ui/app-toaster";

const MAX_DEFAULT_NAME = 60;

// Starting name: the meal as it was described, trimmed to a sensible length.
export const getDefaultRecipeName = (log: IFoodLog) =>
  log.rawInputText.trim().slice(0, MAX_DEFAULT_NAME);

// Saves a logged meal as a recipe, with the error handling from the API guide:
// 400 inline, 409 refresh the log, 404 meal gone, 404 user → sign out.
// Resolves true when the caller should close the form.
export function useSaveRecipe() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { createRecipe } = useRecipesActionsHook();
  const { fetchFoodLogById, fetchRecentFoodLogs } = useFoodLogsActionsHook();
  const { signOut } = useSignOut();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (log: IFoodLog, name: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your recipe a name.");
      return false;
    }

    setIsSaving(true);
    setError(null);
    try {
      await createRecipe(user.id, trimmed, log);
      return true;
    } catch (err) {
      const status = getErrorStatus(err);
      const message = getErrorMessage(err);

      // Already sent to sign-in by the http client.
      if (isUnauthorizedError(err)) return true;

      // Saved earlier (another device / double tap): refresh so it shows saved.
      if (status === 409) {
        fetchFoodLogById(user.id, log.id).catch((e) =>
          reportRequestError("Error refreshing meal:", e),
        );
        return true;
      }

      if (status === 404 && message.includes("User")) {
        errorToast("Your account wasn't found. Please sign in again.");
        signOut();
        return true;
      }

      // The meal was deleted: drop it from the list.
      if (status === 404) {
        errorToast("This meal no longer exists");
        fetchRecentFoodLogs(user.id).catch((e) =>
          reportRequestError("Error refreshing meals:", e),
        );
        return true;
      }

      // 400 (e.g. "name: Recipe name is required!") and anything else: inline.
      setError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error, clearError: () => setError(null) };
}
