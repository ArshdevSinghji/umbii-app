import { ApiResponse } from "@/lib/http-client";
import { getTimezone } from "@/lib/timezone";
import { SignInRequest, SignInResponse } from "./sign-in.types";

// No access token needed. Returns the account with an access token and a
// refresh token.
export const signInService = async (
  request: SignInRequest,
): Promise<ApiResponse<SignInResponse>> => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Required here too: a new account saves its zone at sign-up.
  const timezone = getTimezone();
  if (timezone) headers["X-Timezone"] = timezone;

  const response = await fetch(`${url}/sign-in`, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "Something went wrong");
  }

  return response.json();
};
