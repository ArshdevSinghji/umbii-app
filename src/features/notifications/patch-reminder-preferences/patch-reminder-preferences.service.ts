import { ApiResponse, http } from "@/lib/http-client";
import { IReminderPreferences } from "../notifications.types";
import { PatchReminderPreferencesRequest } from "./patch-reminder-preferences.types";

// Returns every reminder preference, not just the changed ones.
export const patchReminderPreferencesService = async (
  request: PatchReminderPreferencesRequest,
) => {
  const { userId, ...changes } = request;
  return await http.patch<ApiResponse<IReminderPreferences>>(
    `/users/${userId}/reminder-preferences`,
    changes,
  );
};
