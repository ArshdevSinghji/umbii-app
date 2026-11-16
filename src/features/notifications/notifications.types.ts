export enum NotificationActionTypes {
  REGISTER_PUSH_DEVICE = "notifications/register-push-device",
  UNREGISTER_PUSH_DEVICE = "notifications/unregister-push-device",
  GET_NOTIFICATION_PREFERENCES = "notifications/get-notification-preferences",
  PATCH_NOTIFICATION_PREFERENCES = "notifications/patch-notification-preferences",
  GET_REMINDER_PREFERENCES = "notifications/get-reminder-preferences",
  PATCH_REMINDER_PREFERENCES = "notifications/patch-reminder-preferences",
}

export type PushPlatform = "ios" | "android";

// An account has one push device: registering a new token replaces it. The
// server removes it when the session ends (sign-out, sign-in elsewhere).
export interface IPushDevice {
  id: number;
  expoPushToken: string;
  platform: PushPlatform;
}

export type WeighInFrequency = "daily" | "weekly";

// How notifications are delivered. Times are "HH:mm", local to `timezone`:
// the zone last sent as X-Timezone, read-only. Quiet hours over midnight
// have a start after the end. Reminders at the user's chosen times aren't
// capped; anything else is at most 3 a day. "Signed out elsewhere" ignores
// all of this.
export interface INotificationPreferences {
  timezone: string | null;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  // Saved, but the server sends nothing for it yet.
  reEngagementEnabled: boolean;
}

// Which reminders the server sends, and when (GET /reminder-preferences,
// defaults until saved). Times are "HH:mm" in `timezone` (read-only, as
// above); `weighInDayOfWeek` is 1 (Monday) to 7 (Sunday). Quiet hours still
// apply. Meal and weigh-in reminders are skipped once that's logged.
export interface IReminderPreferences {
  timezone: string | null;
  mealRemindersEnabled: boolean;
  breakfastReminderTime: string;
  lunchReminderTime: string;
  dinnerReminderTime: string;
  dailyTargetNudgeEnabled: boolean;
  dailyTargetNudgeTime: string;
  weighInReminderEnabled: boolean;
  weighInFrequency: WeighInFrequency;
  weighInReminderTime: string;
  weighInDayOfWeek: number;
  // These two are saved, but the server sends nothing for them yet.
  weeklySummaryEnabled: boolean;
  targetUpdateAlertsEnabled: boolean;
  // "Goal weight reached".
  milestoneAlertsEnabled: boolean;
}

export interface NotificationsState {
  // Set by registering on this device; needed to unregister. Null when push
  // is off, not allowed, or not registered yet.
  pushDeviceId: number | null;
  notificationPreferences: INotificationPreferences | null;
  reminderPreferences: IReminderPreferences | null;
}
