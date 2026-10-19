import { IUser, IUserProfile } from "../user.types";

export interface GetUserRequest {
  userId: number;
}

// The account (no token) plus the onboarding profile, null before
// onboarding.
export type GetUserResponse = Omit<IUser, "token"> & {
  profile: IUserProfile | null;
};
