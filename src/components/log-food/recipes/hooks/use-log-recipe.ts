import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IRecipe } from "@/features/recipes/recipes.types";
import { removeRecipe } from "@/features/recipes/recipes.slice";
import {
  getErrorMessage,
  getErrorStatus,
  isUnauthorizedError,
} from "@/lib/http-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { errorToast } from "@/components/ui/app-toaster";

// Logs a recipe as a new meal for today: POST /food-logs with the recipe's
// own items, its name as the description and its id, so the meal stays
// linked to the recipe. A recipe can be logged any number of times. The
// saved log comes back and the food-logs slice adds it to Recent meals, Home
// and Breakdown.
export function useLogRecipe() {
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  const { createFoodLogs } = useFoodLogsActionsHook();
  const [isLogging, setIsLogging] = useState(false);

  // Resolves true when logged.
  const logRecipe = async (recipe: IRecipe): Promise<boolean> => {
    const details = (recipe.details ?? []).map(
      ({ id, createdAt, updatedAt, ...item }) => item,
    );
    if (details.length === 0) {
      errorToast("This recipe has no items to log");
      return false;
    }

    setIsLogging(true);
    try {
      await createFoodLogs(user.id, recipe.name, details, recipe.id);
      return true;
    } catch (error) {
      // 401 is already handled by sending the user to sign in.
      if (isUnauthorizedError(error)) return false;
      // The recipe was deleted (e.g. on another device): drop it and close.
      if (getErrorStatus(error) === 404) {
        errorToast("This recipe no longer exists");
        dispatch(removeRecipe(recipe.id));
        return true;
      }
      errorToast(getErrorMessage(error));
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  return { logRecipe, isLogging };
}
