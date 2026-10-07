export type BmiCategoryLabel = "Underweight" | "Healthy" | "Overweight" | "Obese";

export interface BmiCategory {
  label: BmiCategoryLabel;
  min: number;
}

// WHO adult BMI ranges, lowest first.
export const BMI_CATEGORIES: BmiCategory[] = [
  { label: "Underweight", min: 0 },
  { label: "Healthy", min: 18.5 },
  { label: "Overweight", min: 25 },
  { label: "Obese", min: 30 },
];

// Range drawn on the BMI scale bar.
export const BMI_SCALE_MIN = 15;
export const BMI_SCALE_MAX = 40;

export function calculateBmi(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBmiCategory(bmi: number) {
  return [...BMI_CATEGORIES].reverse().find((category) => bmi >= category.min)!;
}
