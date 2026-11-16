import { ApiResponse, http } from "@/lib/http-client";
import {
  GetUserProfileRequest,
  GetUserProfileResponse,
} from "./get-user-profile.types";

// The onboarding answers. 404 until the user has onboarded.
export const getUserProfileService = async (request: GetUserProfileRequest) => {
  const { userId } = request;
  return await http.get<ApiResponse<GetUserProfileResponse>>(
    `/users/${userId}/nutrition-profile`,
  );
};
