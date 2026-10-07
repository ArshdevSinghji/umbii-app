export enum FoodLogActionTypes {
  LIST_FOOD_LOGS = "food-logs/list-food-logs",
  LIST_RECENT_FOOD_LOGS = "food-logs/list-recent-food-logs",
  CREATE_FOOD_LOGS = "food-logs/create-food-logs",
  GENERATE_FOOD_LOGS = "food-logs/generate-food-logs",
  GET_FOOD_LOG = "food-logs/get-food-log",
}

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface IFoodLogDetail {
  id: number;
  name: string;
  servingQuantity: string;
  servingUnit: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  sugar: string;
  sodium: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodLog {
  id: number;
  rawInputText: string;
  createdAt: string;
  details: IFoodLogDetail[];
}

export interface GenerateFoodLogsDetails {
  remark: string;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
}

export interface FoodLogState {
  isLoading: boolean;
  listFoodLogs: IFoodLog[];
  generatedFoodLogsDetails: GenerateFoodLogsDetails;
  selectedFoodLog: IFoodLog | null;
  isFoodLogLoading: boolean;
  // Last 7 days for the Log Food page; separate from `listFoodLogs`,
  // which Home/Breakdown fill per date.
  recentFoodLogs: IFoodLog[];
}
