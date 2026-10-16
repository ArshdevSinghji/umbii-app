import MealSheet from "@/components/meal-sheet";
import MealSheetContent from "@/components/meal-sheet/content";
import { useRecipesActionsHook } from "@/features/recipes/recipes.hooks";
import { IRecipe } from "@/features/recipes/recipes.types";
import { useState } from "react";
import DeleteRecipeSheet from "../delete-recipe-sheet";
import { useLogRecipe } from "../hooks/use-log-recipe";
import RecipeSheetFooter from "../recipe-sheet-footer";
import RenameRecipeSheet from "../rename-recipe-sheet";

interface IProps {
  // The recipe that was opened; kept by the parent after closing so the
  // sheet can slide out with its content.
  recipe: IRecipe | null;
  visible: boolean;
  onClose: () => void;
}

// A recipe's details (same sheet as a logged meal) with "Log this meal",
// rename and delete. Shared by Log Food's carousel and the Saved recipes
// page. The items come with the recipe list — no extra request.
export default function RecipeSheet({ recipe, visible, onClose }: IProps) {
  const { listRecipes } = useRecipesActionsHook();
  const { logRecipe, isLogging } = useLogRecipe();

  // The live copy from the list (so a rename shows straight away), falling
  // back to the opened one while the sheet slides out after a delete.
  const sheetRecipe =
    listRecipes.find((item) => item.id === recipe?.id) ?? recipe;

  // Which child sheet (rename / delete) is open over the recipe sheet.
  const [childSheet, setChildSheet] = useState<"rename" | "delete" | null>(
    null,
  );
  const [isChildBusy, setIsChildBusy] = useState(false);
  // Bumped per opening so a child sheet remounts fresh (name, errors).
  const [childCount, setChildCount] = useState(0);

  const openChildSheet = (sheet: "rename" | "delete") => {
    setChildCount((count) => count + 1);
    setChildSheet(sheet);
  };

  const closeChildSheet = () => setChildSheet(null);

  // Closes the recipe sheet and anything on top of it.
  const closeAll = () => {
    setChildSheet(null);
    onClose();
  };

  // Back / backdrop: close a child sheet first, then the recipe sheet.
  // Nothing closes while a request (log / rename / delete) is in flight.
  const handleClose = () => {
    if (isLogging || isChildBusy) return;
    if (childSheet) closeChildSheet();
    else onClose();
  };

  const handleLogRecipe = async () => {
    if (!sheetRecipe) return;
    if (await logRecipe(sheetRecipe)) closeAll();
  };

  return (
    <MealSheet
      visible={visible}
      title="Recipe details"
      onClose={handleClose}
      overlay={
        sheetRecipe && (
          <>
            <RenameRecipeSheet
              // Remount per opening: fresh name and no stale error.
              key={`rename-${sheetRecipe.id}-${childCount}`}
              visible={childSheet === "rename"}
              recipe={sheetRecipe}
              onClose={closeChildSheet}
              onGone={closeAll}
              onBusyChange={setIsChildBusy}
            />
            <DeleteRecipeSheet
              key={`delete-${sheetRecipe.id}-${childCount}`}
              visible={childSheet === "delete"}
              recipe={sheetRecipe}
              onClose={closeChildSheet}
              onDeleted={closeAll}
              onBusyChange={setIsChildBusy}
            />
          </>
        )
      }
      footer={
        <RecipeSheetFooter
          onLog={handleLogRecipe}
          isLogging={isLogging}
          onRename={() => openChildSheet("rename")}
          onDelete={() => openChildSheet("delete")}
        />
      }
    >
      {sheetRecipe && (
        <MealSheetContent
          log={{
            rawInputText: sheetRecipe.name,
            details: sheetRecipe.details ?? [],
          }}
        />
      )}
    </MealSheet>
  );
}
