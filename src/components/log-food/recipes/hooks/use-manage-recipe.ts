import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { removeRecipe } from "@/features/recipes/recipes.slice";
import { IRecipe } from "@/features/recipes/recipes.types";
import {
  getErrorMessage,
  getErrorStatus,
  isUnauthorizedError,
} from "@/lib/http-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { errorToast } from "@/components/ui/app-toaster";

// Rename (the only editable field) and delete, with the API guide's errors:
// 400 inline, 404 "Recipe does not exist" → toast and drop it from the list.
// Each action resolves "done" (close the form/sheet) or "error" (stay).
export function useManageRecipe() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userSlice);
  const { updateRecipe, deleteRecipe } = useRecipesActionsHook();

  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared failure handling; returns true when the recipe is gone.
  const handleFailure = (recipe: IRecipe, err: unknown) => {
    if (isUnauthorizedError(err)) return true; // already heading to sign-in
    if (getErrorStatus(err) === 404) {
      errorToast("This recipe no longer exists");
      dispatch(removeRecipe(recipe.id));
      return true;
    }
    setError(getErrorMessage(err));
    return false;
  };

  const rename = async (recipe: IRecipe, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your recipe a name.");
      return "error" as const;
    }
    if (trimmed === recipe.name) return "done" as const;

    setIsBusy(true);
    setError(null);
    try {
      await updateRecipe(user.id, recipe.id, trimmed);
      return "done" as const;
    } catch (err) {
      return handleFailure(recipe, err)
        ? ("gone" as const)
        : ("error" as const);
    } finally {
      setIsBusy(false);
    }
  };

  // The food log stays in the diary; its recipeId goes back to null (the
  // food-logs slice resets it), so it can be saved again.
  const remove = async (recipe: IRecipe) => {
    setIsBusy(true);
    setError(null);
    try {
      await deleteRecipe(user.id, recipe.id);
      return "done" as const;
    } catch (err) {
      return handleFailure(recipe, err)
        ? ("gone" as const)
        : ("error" as const);
    } finally {
      setIsBusy(false);
    }
  };

  return { rename, remove, isBusy, error, clearError: () => setError(null) };
}
