import { SignInRequest } from "./sign-in.types";

export const signInService = async (request: SignInRequest) => {
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
