import { IUser, IUserProfile } from "../user.types";

export interface GetUserRequest {
  userId: number;
}

// The account plus the onboarding profile, null before onboarding.
export type GetUserResponse = IUser & {
  profile: IUserProfile | null;
};
