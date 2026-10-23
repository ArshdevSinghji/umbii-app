import { createSlice } from "@reduxjs/toolkit";
import { clearUser } from "@/features/user/user.slice";
import { getNotificationPreferencesAction } from "./get-notification-preferences/get-notification-preferences.action";
import { NotificationsState } from "./notifications.types";
import { patchNotificationPreferencesAction } from "./patch-notification-preferences/patch-notification-preferences.action";
import { registerPushDeviceAction } from "./register-push-device/register-push-device.action";
import { unregisterPushDeviceAction } from "./unregister-push-device/unregister-push-device.action";

const initialState: NotificationsState = {
  pushDeviceId: null,
  preferences: null,
  isPreferencesLoading: false,
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
      .addCase(getNotificationPreferencesAction.pending, (state) => {
        state.isPreferencesLoading = true;
      })
      .addCase(getNotificationPreferencesAction.fulfilled, (state, action) => {
        state.isPreferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(getNotificationPreferencesAction.rejected, (state) => {
        state.isPreferencesLoading = false;
      })
      // Optimistic: switches and times change on tap. A failed save is
      // undone by refetching (see the hook).
      .addCase(patchNotificationPreferencesAction.pending, (state, action) => {
        if (!state.preferences) return;
        const { userId, ...changes } = action.meta.arg;
        state.preferences = { ...state.preferences, ...changes };
      })
      .addCase(
        patchNotificationPreferencesAction.fulfilled,
        (state, action) => {
          state.preferences = action.payload;
        },
      );
  },
});

export const notificationsReducer = notificationsSlice.reducer;
