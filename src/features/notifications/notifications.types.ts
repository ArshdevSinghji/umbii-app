export enum NotificationActionTypes {
  REGISTER_PUSH_DEVICE = "notifications/register-push-device",
  UNREGISTER_PUSH_DEVICE = "notifications/unregister-push-device",
  GET_NOTIFICATION_PREFERENCES = "notifications/get-notification-preferences",
  PATCH_NOTIFICATION_PREFERENCES = "notifications/patch-notification-preferences",
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

// Times are "HH:mm", local to `timezone` (sent with every registration).
// `weighInDayOfWeek` is 1 (Monday) to 7 (Sunday). The server sends at most 3
// a day and nothing in quiet hours; quiet hours over midnight have a start
// after the end. "Signed out elsewhere" ignores all of this.
export interface INotificationPreferences {
  timezone: string | null;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
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
  weeklySummaryEnabled: boolean;
  targetUpdateAlertsEnabled: boolean;
  milestoneAlertsEnabled: boolean;
  reEngagementEnabled: boolean;
}

export interface NotificationsState {
  // Set by registering on this device; needed to unregister. Null when push
  // is off, not allowed, or not registered yet.
  pushDeviceId: number | null;
  preferences: INotificationPreferences | null;
  isPreferencesLoading: boolean;
}
