export enum UserActionTypes {
  SIGN_IN = "auth/sign-in",
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
