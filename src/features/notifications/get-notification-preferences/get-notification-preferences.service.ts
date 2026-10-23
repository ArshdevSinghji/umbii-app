import { ApiResponse, http } from "@/lib/http-client";
import { INotificationPreferences } from "../notifications.types";
import { GetNotificationPreferencesRequest } from "./get-notification-preferences.types";

// The server's defaults when none are saved yet.
export const getNotificationPreferencesService = async (
  request: GetNotificationPreferencesRequest,
) => {
  const { userId } = request;
  return await http.get<ApiResponse<INotificationPreferences>>(
    `/users/${userId}/notification-preferences`,
  );
};
