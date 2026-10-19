import type { LoadStatus } from "@/features/weight-journals/weight-journals.types";

export enum UserActionTypes {
  SIGN_IN = "auth/sign-in",
  GET_USER = "user/get-user",
  SAVE_USER_ONBOARDING = "user/save-user-onboarding",
  UPDATE_USER = "user/update-user",
  DELETE_USER = "user/delete-user",
  LIST_FOOD_LOGS = "user/list-food-logs",
  CREATE_FOOD_LOGS = "user/create-food-logs",
}

export interface IUser {
  id: number;
  email: string;
  token: string;
  username: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  // When the account was created. Sign-in doesn't return it; GET /users/{id}
  // and updates do. Missing until then: treat that as "no lower limit".
  // Height lives on the profile.
  createdAt?: string;
}

// String enums: the values are what the API sends and expects.
export enum Sex {
  Male = "male",
  Female = "female",
}

export enum GoalType {
  FatLoss = "fat_loss",
  Maintenance = "maintenance",
  Hypertrophy = "hypertrophy",
}

// Activity outside workouts.
export enum ActivityLevel {
  Sedentary = "sedentary",
  LightActive = "light_active",
  VeryActive = "very_active",
}

export enum TrainingType {
  Lifting = "lifting",
  Cardio = "cardio",
  Mixed = "mixed",
  Sport = "sport",
}

export enum DietType {
  Vegetarian = "vegetarian",
  Eggetarian = "eggetarian",
  NonVeg = "non_veg",
  Vegan = "vegan",
  Jain = "jain",
  Halal = "halal",
}

export enum Allergy {
  Lactose = "lactose",
  Gluten = "gluten",
  Nuts = "nuts",
  Soy = "soy",
  Eggs = "eggs",
  Shellfish = "shellfish",
}

export enum HealthFlag {
  PregnantOrBreastfeeding = "pregnant_or_breastfeeding",
  Diabetes = "diabetes",
  KidneyDisease = "kidney_disease",
  HighBloodPressure = "high_blood_pressure",
  EatingDisorderHistory = "eating_disorder_history",
}

// The onboarding answers, nested in GET /users/{userId} as `profile` (null
// before onboarding). Targets are generated from it. Health flags are
// sensitive, so it's kept in state but not persisted with the user.
export interface IUserProfile {
  sex: Sex;
  // "YYYY-MM-DD".
  dateOfBirth: string;
  heightCm: number;
  goalType: GoalType;
  // Null for maintenance.
  targetWeightKg: number | null;
  // kg per week, negative for loss; null for maintenance.
  weeklyRateKg: number | null;
  workoutsPerWeek: number;
  activityLevel: ActivityLevel;
  // Null when the athlete doesn't train.
  trainingType: TrainingType | null;
  avgSessionMinutes: number | null;
  dietType: DietType;
  // Empty when none.
  allergies: Allergy[];
  healthFlags: HealthFlag[];
  // When onboarding was completed.
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  // Sign-in only.
  isLoading: boolean;
  // Account updates; never blocks the sign-in screen.
  isUpdating: boolean;
  user: IUser;
  // Not persisted (see IUserProfile). Null until loaded and before
  // onboarding; `profileStatus` tells those apart.
  profile: IUserProfile | null;
  profileStatus: LoadStatus;
  isSavingOnboarding: boolean;
  isDeleting: boolean;
}
