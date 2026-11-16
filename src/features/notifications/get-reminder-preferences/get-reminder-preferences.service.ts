import { ApiResponse, http } from "@/lib/http-client";
import { IReminderPreferences } from "../notifications.types";
import { GetReminderPreferencesRequest } from "./get-reminder-preferences.types";

// The server's defaults when none are saved yet.
export const getReminderPreferencesService = async (
  request: GetReminderPreferencesRequest,
) => {
  const { userId } = request;
  return await http.get<ApiResponse<IReminderPreferences>>(
    `/users/${userId}/reminder-preferences`,
  );
};
