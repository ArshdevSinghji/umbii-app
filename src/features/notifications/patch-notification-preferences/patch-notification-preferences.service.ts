import { ApiResponse, http } from "@/lib/http-client";
import { INotificationPreferences } from "../notifications.types";
import { PatchNotificationPreferencesRequest } from "./patch-notification-preferences.types";

// Returns every preference, not just the changed ones.
export const patchNotificationPreferencesService = async (
  request: PatchNotificationPreferencesRequest,
) => {
  const { userId, ...changes } = request;
  return await http.patch<ApiResponse<INotificationPreferences>>(
    `/users/${userId}/notification-preferences`,
    changes,
  );
};
