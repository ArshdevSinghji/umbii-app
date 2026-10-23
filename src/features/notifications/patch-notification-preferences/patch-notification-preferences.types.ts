import { INotificationPreferences } from "../notifications.types";

// Partial: send only what changed.
export type PatchNotificationPreferencesRequest = {
  userId: number;
} & Partial<INotificationPreferences>;
