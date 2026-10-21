import { IUser } from "../user.types";

export interface SignInRequest {
  username: string;
  email: string;
  imageUrl?: string;
  phoneNumber?: string;
}

// The account plus both tokens. The tokens go to SecureStore only; the slice
// keeps the account without them.
export type SignInResponse = IUser & {
  token: string;
  refreshToken: string;
};
