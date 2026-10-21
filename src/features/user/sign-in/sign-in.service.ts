import { ApiResponse } from "@/lib/http-client";
import { SignInRequest, SignInResponse } from "./sign-in.types";

// No access token needed. Returns the account with an access token and a
// refresh token.
export const signInService = async (
  request: SignInRequest,
): Promise<ApiResponse<SignInResponse>> => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const response = await fetch(`${url}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "Something went wrong");
  }

  return response.json();
};
