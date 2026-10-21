import { IUser } from "../user.types";

// PUT /users/{userId} is a full replace of the account fields: `username` is
// required and any optional field left out (imageUrl, phoneNumber) is
// cleared. Height lives on the profile (set by onboarding).
export interface UpdateUserRequest {
  userId: number;
  username: string;
  imageUrl: string | null;
  phoneNumber: string | null;
}

export type UpdateUserResponse = IUser;
