// "min": more is better (e.g. fiber). "max": less is better (e.g. sugar).
export type NutrientGoal = "min" | "max";

export interface ScoredNutrient {
  value: number;
  target: number;
  goal: NutrientGoal;
}

export const HEALTH_SCORE_MAX = 10;

// 0..1 credit for one nutrient. "min" earns the fraction of the target
// reached; "max" is full credit up to the target, then drops to 0 at double.
// No target set means nothing to miss, so full credit.
export function scoreNutrient({ value, target, goal }: ScoredNutrient) {
  if (target <= 0) return 1;
  if (goal === "min") return Math.min(1, value / target);
  if (value <= target) return 1;
  return Math.max(0, 1 - (value - target) / target);
}

// Average credit across nutrients, scaled to 0..10 and rounded.
export function calculateHealthScore(nutrients: ScoredNutrient[]) {
  if (nutrients.length === 0) return 0;
  const average =
    nutrients.reduce((sum, nutrient) => sum + scoreNutrient(nutrient), 0) /
    nutrients.length;
  return Math.round(average * HEALTH_SCORE_MAX);
}

export function getHealthScoreLabel(score: number) {
  if (score >= 8) return "Great";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Poor";
}
