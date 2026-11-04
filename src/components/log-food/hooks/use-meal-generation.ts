import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { useEffect, useRef, useState } from "react";

// What the status chip in the composer says while the meal is worked out.
// Steps forward on a timer and holds on the last one until the reply comes,
// so a slow request still looks like progress, not a frozen spinner.
export const GENERATION_STAGES = [
  "Reading your meal",
  "Identifying foods",
  "Estimating portions",
  "Calculating nutrition",
];
const STAGE_MS = 1400;

export interface IPendingMeal {
  text: string;
  stage: number;
}

// Sends a meal description to be turned into items, and tracks it while it's
// in flight so Log Food can show the message and its progress.
export function useMealGeneration() {
  const { generateFoodLogs } = useFoodLogsActionsHook();
  const [pending, setPending] = useState<IPendingMeal | null>(null);
  // Enter and the send button can both fire before `pending` re-renders.
  const isBusy = useRef(false);

  const isGenerating = pending !== null;
  useEffect(() => {
    if (!isGenerating) return;
    const timer = setInterval(() => {
      setPending((current) =>
        current && current.stage < GENERATION_STAGES.length - 1
          ? { ...current, stage: current.stage + 1 }
          : current,
      );
    }, STAGE_MS);
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Resolves once the result is in the store; throws if it failed.
  const generate = async (userId: number, text: string) => {
    if (isBusy.current) return false;
    isBusy.current = true;
    setPending({ text, stage: 0 });
    try {
      await generateFoodLogs(userId, text);
      return true;
    } finally {
      isBusy.current = false;
      setPending(null);
    }
  };

  return { pending, isGenerating, generate };
}
