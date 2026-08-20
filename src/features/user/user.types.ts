export enum UserActionTypes {
  SIGN_IN = "auth/sign-in",
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
}

export interface UserState {
  isLoading: boolean;
  user: IUser;
}
