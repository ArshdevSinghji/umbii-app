import { createSlice } from "@reduxjs/toolkit";
import { clearUser } from "@/features/user/user.slice";
import { getNotificationPreferencesAction } from "./get-notification-preferences/get-notification-preferences.action";
import { getReminderPreferencesAction } from "./get-reminder-preferences/get-reminder-preferences.action";
import { NotificationsState } from "./notifications.types";
import { patchNotificationPreferencesAction } from "./patch-notification-preferences/patch-notification-preferences.action";
import { patchReminderPreferencesAction } from "./patch-reminder-preferences/patch-reminder-preferences.action";
import { registerPushDeviceAction } from "./register-push-device/register-push-device.action";
import { unregisterPushDeviceAction } from "./unregister-push-device/unregister-push-device.action";

const initialState: NotificationsState = {
  pushDeviceId: null,
  notificationPreferences: null,
  reminderPreferences: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Another account may sign in next.
      .addCase(clearUser, () => initialState)
      .addCase(registerPushDeviceAction.fulfilled, (state, action) => {
        state.pushDeviceId = action.payload.id;
      })
      // Off straight away; the switch shouldn't wait on the request.
      .addCase(unregisterPushDeviceAction.pending, (state) => {
        state.pushDeviceId = null;
      })
      .addCase(getNotificationPreferencesAction.fulfilled, (state, action) => {
        state.notificationPreferences = action.payload;
      })
      .addCase(getReminderPreferencesAction.fulfilled, (state, action) => {
        state.reminderPreferences = action.payload;
      })
      // Optimistic: switches and times change on tap. A failed save is
      // undone by refetching (see the hook).
      .addCase(patchNotificationPreferencesAction.pending, (state, action) => {
        if (!state.notificationPreferences) return;
        const { userId, ...changes } = action.meta.arg;
        state.notificationPreferences = {
          ...state.notificationPreferences,
          ...changes,
        };
      })
      .addCase(
        patchNotificationPreferencesAction.fulfilled,
        (state, action) => {
          state.notificationPreferences = action.payload;
        },
      )
      .addCase(patchReminderPreferencesAction.pending, (state, action) => {
        if (!state.reminderPreferences) return;
        const { userId, ...changes } = action.meta.arg;
        state.reminderPreferences = {
          ...state.reminderPreferences,
          ...changes,
        };
      })
      .addCase(patchReminderPreferencesAction.fulfilled, (state, action) => {
        state.reminderPreferences = action.payload;
      });
  },
});

export const notificationsReducer = notificationsSlice.reducer;
