import { IUser } from "../user.types";

// PUT /users/{userId} is a full replace: `username` is required and any
// optional field left out (imageUrl, phoneNumber, height) is cleared.
export interface UpdateUserRequest {
  userId: number;
  username: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  // Centimeters.
  height: number | null;
}

// Profile only; the token isn't returned here.
export type UpdateUserResponse = Omit<IUser, "token">;
