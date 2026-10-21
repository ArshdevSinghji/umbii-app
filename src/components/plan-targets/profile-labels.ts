import {
  ActivityLevel,
  Allergy,
  DietType,
  GoalType,
  HealthFlag,
  TrainingType,
} from "@/features/user/user.types";

// How each saved answer reads back to the user.

export const GOAL_LABELS: Record<GoalType, string> = {
  [GoalType.FatLoss]: "Lose fat",
  [GoalType.Maintenance]: "Maintain",
  [GoalType.Hypertrophy]: "Build muscle",
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]: "Mostly sitting",
  [ActivityLevel.LightActive]: "On my feet a lot",
  [ActivityLevel.VeryActive]: "Physical work",
};

export const TRAINING_LABELS: Record<TrainingType, string> = {
  [TrainingType.Lifting]: "Lifting",
  [TrainingType.Cardio]: "Cardio",
  [TrainingType.Mixed]: "Mixed",
  [TrainingType.Sport]: "Sport/other",
};

export const DIET_LABELS: Record<DietType, string> = {
  [DietType.Vegetarian]: "Vegetarian",
  [DietType.Eggetarian]: "Eggetarian",
  [DietType.NonVeg]: "Non-veg",
  [DietType.Vegan]: "Vegan",
  [DietType.Jain]: "Jain",
  [DietType.Halal]: "Halal",
};

export const ALLERGY_LABELS: Record<Allergy, string> = {
  [Allergy.Lactose]: "Lactose",
  [Allergy.Gluten]: "Gluten",
  [Allergy.Nuts]: "Nuts",
  [Allergy.Soy]: "Soy",
  [Allergy.Eggs]: "Eggs",
  [Allergy.Shellfish]: "Shellfish",
};

export const HEALTH_LABELS: Record<HealthFlag, string> = {
  [HealthFlag.PregnantOrBreastfeeding]: "Pregnant or breastfeeding",
  [HealthFlag.Diabetes]: "Diabetes",
  [HealthFlag.KidneyDisease]: "Kidney disease",
  [HealthFlag.HighBloodPressure]: "High blood pressure",
  [HealthFlag.EatingDisorderHistory]: "History of an eating disorder",
};

// Session lengths are saved as one number per range (see the week step).
const SESSION_LABELS: Record<number, string> = {
  20: "Under 30 min",
  38: "30-45 min",
  53: "45-60 min",
  75: "60-90 min",
  100: "90+ min",
};

export const getSessionLabel = (minutes: number) =>
  SESSION_LABELS[minutes] ?? `${minutes} min`;
