import { IUserProfile } from "../user.types";

export interface GetUserProfileRequest {
  userId: number;
}

export type GetUserProfileResponse = IUserProfile;
