import { INotificationPreferences } from "../notifications.types";

// Partial: send only what changed. The time zone comes from X-Timezone.
export type NotificationPreferenceChanges = Partial<
  Omit<INotificationPreferences, "timezone">
>;

export type PatchNotificationPreferencesRequest = {
  userId: number;
} & NotificationPreferenceChanges;
