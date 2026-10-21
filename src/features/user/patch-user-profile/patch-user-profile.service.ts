import { ApiResponse, http } from "@/lib/http-client";
import {
  PatchUserProfileRequest,
  PatchUserProfileResponse,
} from "./patch-user-profile.types";

export const patchUserProfileService = async (
  request: PatchUserProfileRequest,
) => {
  const { userId, ...changes } = request;
  return await http.patch<ApiResponse<PatchUserProfileResponse>>(
    `/users/${userId}/profile`,
    changes,
  );
};
