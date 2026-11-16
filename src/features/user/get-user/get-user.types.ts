import { IUser } from "../user.types";

export interface GetUserRequest {
  userId: number;
}

// The account only; the onboarding answers have their own endpoint.
export type GetUserResponse = IUser;
