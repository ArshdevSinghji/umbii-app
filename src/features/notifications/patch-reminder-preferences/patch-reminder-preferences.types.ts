import { IReminderPreferences } from "../notifications.types";

// Partial: send only what changed. The time zone comes from X-Timezone.
export type ReminderPreferenceChanges = Partial<
  Omit<IReminderPreferences, "timezone">
>;

export type PatchReminderPreferencesRequest = {
  userId: number;
} & ReminderPreferenceChanges;
