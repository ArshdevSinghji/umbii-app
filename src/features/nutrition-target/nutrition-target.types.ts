export enum NutritionTargetActionTypes {
  CREATE_NUTRITION_TARGET = "CREATE_NUTRITION_TARGET",
}

export enum GoalType {
    FAT_LOSS = "FAT_LOSS",
    HYPERTROPHY = "HYPERTROPHY",
    MAINTENANCE = "MAINTENANCE",
    BODY_RECOMPOSITION = "BODY_RECOMPOSITION",
}

export interface NutritionTargetState {
  isLoading: boolean;
}
