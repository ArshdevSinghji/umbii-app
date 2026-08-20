export enum FoodLogActionTypes {
  LIST_FOOD_LOGS = "food-logs/list-food-logs",
  CREATE_FOOD_LOGS = "food-logs/create-food-logs",
  GENERATE_FOOD_LOGS = "food-logs/generate-food-logs",
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
  details: Omit<IFoodLogDetail, 'id' | 'createdAt' | 'updatedAt'>[];
}

export interface FoodLogState {
  isLoading: boolean;
  listFoodLogs: IFoodLog[];
  generatedFoodLogsDetails: GenerateFoodLogsDetails;
}
