export enum FoodLogActionTypes {
  LIST_FOOD_LOGS = "food-logs/list-food-logs",
  LIST_RECENT_FOOD_LOGS = "food-logs/list-recent-food-logs",
  LIST_PERIOD_FOOD_LOGS = "food-logs/list-period-food-logs",
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

// Macros are numbers: calories in kcal, sodium in mg, the rest in grams.
// Dates are plain "yyyy-MM-dd" strings (no time or zone).
export interface IFoodLogDetail {
  id: number;
  name: string;
  servingQuantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFoodLog {
  id: number;
  rawInputText: string;
  createdAt: string;
  // Id of the recipe saved from this log, or null if it isn't one.
  recipeId: number | null;
  details: IFoodLogDetail[];
}

export interface GenerateFoodLogsDetails {
  remark: string;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
}

export interface FoodLogState {
  // Date Home last asked for, and Breakdown's range: lets a newly created
  // log be added to whichever lists it belongs in without refetching.
  listFoodLogsDate: string | null;
  periodRange: { startDate: string; endDate: string } | null;
  // Generating / saving a meal (Log Food).
  isLoading: boolean;
  // Home's selected day.
  listFoodLogs: IFoodLog[];
  isListLoading: boolean;
  // Breakdown's selected period (day / week / month / year).
  periodFoodLogs: IFoodLog[];
  isPeriodFoodLogsLoading: boolean;
  generatedFoodLogsDetails: GenerateFoodLogsDetails;
  selectedFoodLog: IFoodLog | null;
  isFoodLogLoading: boolean;
  // Last 7 days for the Log Food page; separate from `listFoodLogs`,
  // which Home/Breakdown fill per date.
  recentFoodLogs: IFoodLog[];
}
