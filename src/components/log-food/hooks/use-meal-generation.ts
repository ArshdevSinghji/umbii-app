import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { IMealImage } from "@/features/food-logs/generate-food-logs/generate-food-logs.types";
import { useEffect, useRef, useState } from "react";

// What the status chip in the composer says while the meal is worked out.
// Steps forward on a timer and holds on the last one until the reply comes,
// so a slow request still looks like progress, not a frozen spinner.
const TEXT_STAGES = [
  "Reading your meal",
  "Identifying foods",
  "Estimating portions",
  "Calculating nutrition",
];
const IMAGE_STAGES = [
  "Looking at your photo",
  "Identifying foods",
  "Estimating portions",
  "Calculating nutrition",
];
const TEXT_STAGE_MS = 1400;
// Photos take several seconds; slower steps, so they don't all run out early.
const IMAGE_STAGE_MS = 2500;

export function getGenerationStages(hasImage: boolean) {
  return hasImage ? IMAGE_STAGES : TEXT_STAGES;
}

export interface IPendingMeal {
  text: string;
  images: IMealImage[];
  stage: number;
}

// Sends a meal (text, photos, or both) to be turned into items, and tracks
// it while it's in flight so Log Food can show the message and its progress.
export function useMealGeneration() {
  const { generateFoodLogs } = useFoodLogsActionsHook();
  const [pending, setPending] = useState<IPendingMeal | null>(null);
  // Enter and the send button can both fire before `pending` re-renders.
  const isBusy = useRef(false);

  const isGenerating = pending !== null;
  const hasImage = (pending?.images.length ?? 0) > 0;
  useEffect(() => {
    if (!isGenerating) return;
    const lastStage = getGenerationStages(hasImage).length - 1;
    const timer = setInterval(
      () => {
        setPending((current) =>
          current && current.stage < lastStage
            ? { ...current, stage: current.stage + 1 }
            : current,
        );
      },
      hasImage ? IMAGE_STAGE_MS : TEXT_STAGE_MS,
    );
    return () => clearInterval(timer);
  }, [isGenerating, hasImage]);

  // Resolves once the result is in the store; throws if it failed.
  const generate = async (
    userId: number,
    meal: { text: string; images: IMealImage[] },
  ) => {
    if (isBusy.current) return false;
    isBusy.current = true;
    setPending({ ...meal, stage: 0 });
    try {
      await generateFoodLogs(userId, {
        rawInputText: meal.text || undefined,
        images: meal.images.length ? meal.images : undefined,
      });
      return true;
    } finally {
      isBusy.current = false;
      setPending(null);
    }
  };

  return { pending, isGenerating, generate };
}
