export interface SignInRequest {
  username: string;
  email: string;
  imageUrl?: string;
  phoneNumber?: string;
  // Centimeters.
  height?: number;
}
