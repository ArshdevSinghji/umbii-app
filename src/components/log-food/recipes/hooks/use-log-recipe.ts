import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IRecipe } from "@/features/recipes/recipes.types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/http-client";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { errorToast } from "@/components/ui/app-toaster";

// Logs a recipe as a new meal for today. There's no dedicated endpoint yet,
// so (per the API guide) it re-sends the recipe's items to POST /food-logs
// with the recipe's name as the description. The saved log comes back and
// the food-logs slice adds it to Recent meals, Home and Breakdown.
export function useLogRecipe() {
  const { user } = useAppSelector((state) => state.userSlice);
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
      await createFoodLogs(user.id, recipe.name, details);
      return true;
    } catch (error) {
      // 401 is already handled by sending the user to sign in.
      if (!isUnauthorizedError(error)) errorToast(getErrorMessage(error));
      return false;
    } finally {
      setIsLogging(false);
    }
  };

  return { logRecipe, isLogging };
}
