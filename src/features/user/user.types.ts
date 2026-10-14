export enum UserActionTypes {
  SIGN_IN = "auth/sign-in",
  UPDATE_USER = "user/update-user",
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
  // Always in cm. Missing on users persisted before height existed.
  height?: number | null;
  // When the account was created (from sign-in). Missing on users persisted
  // before it was stored; treat that as "no lower limit".
  createdAt?: string;
}

export interface UserState {
  // Sign-in only.
  isLoading: boolean;
  // Profile updates (e.g. height); never blocks the sign-in screen.
  isUpdating: boolean;
  user: IUser;
}
