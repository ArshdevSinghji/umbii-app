export enum UserActionTypes {
  SIGN_IN = "auth/sign-in",
  LIST_FOOD_LOGS = "user/list-food-logs",
}

export interface IUser {
  id: number;
  email: string;
  token: string;
  username: string;
  imageUrl: string | null;
  phoneNumber: string | null;
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

export interface UserState {
  isLoading: boolean;
  user: IUser;
  listFoodLogs: IFoodLog[];
}
