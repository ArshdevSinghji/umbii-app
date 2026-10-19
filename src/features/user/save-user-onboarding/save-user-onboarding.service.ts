import { ApiResponse, http } from "@/lib/http-client";
import {
  SaveUserOnboardingRequest,
  SaveUserOnboardingResponse,
} from "./save-user-onboarding.types";

// Saves the profile, records the weight as today's weigh-in and generates
// the first nutrition target, in one go. Saving again replaces the profile
// and adds a new target.
export const saveUserOnboardingService = async (
  request: SaveUserOnboardingRequest,
) => {
  const { userId, ...answers } = request;
  return await http.post<ApiResponse<SaveUserOnboardingResponse>>(
    `/users/${userId}`,
    answers,
  );
};
