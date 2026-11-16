import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { errorToast } from "@/components/ui/app-toaster";
import { ErrorState } from "@/components/ui/error-state";
import { Text } from "@/components/ui/text";
import {
  PushRegistrationResult,
  useNotificationsActionsHook,
} from "@/features/notifications/notifications.hooks";
import { WeighInFrequency } from "@/features/notifications/notifications.types";
import { NotificationPreferenceChanges } from "@/features/notifications/patch-notification-preferences/patch-notification-preferences.types";
import { ReminderPreferenceChanges } from "@/features/notifications/patch-reminder-preferences/patch-reminder-preferences.types";
import {
  getErrorMessage,
  isUnauthorizedError,
  reportRequestError,
} from "@/lib/http-client";
import { useInitialLoad } from "@/lib/use-initial-load";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { ArrowsClockwise } from "phosphor-react-native/src/icons/ArrowsClockwise";
import { BellRinging } from "phosphor-react-native/src/icons/BellRinging";
import { ChartBar } from "phosphor-react-native/src/icons/ChartBar";
import { Clock } from "phosphor-react-native/src/icons/Clock";
import { Coffee } from "phosphor-react-native/src/icons/Coffee";
import { ForkKnife } from "phosphor-react-native/src/icons/ForkKnife";
import { HandWaving } from "phosphor-react-native/src/icons/HandWaving";
import { Moon } from "phosphor-react-native/src/icons/Moon";
import { MoonStars } from "phosphor-react-native/src/icons/MoonStars";
import { Repeat } from "phosphor-react-native/src/icons/Repeat";
import { Scales } from "phosphor-react-native/src/icons/Scales";
import { Sun } from "phosphor-react-native/src/icons/Sun";
import { SunHorizon } from "phosphor-react-native/src/icons/SunHorizon";
import { Target } from "phosphor-react-native/src/icons/Target";
import { Trophy } from "phosphor-react-native/src/icons/Trophy";
import { useState } from "react";
import { Linking, View } from "react-native";
import DayPicker from "./day-picker";
import NotificationsSkeleton from "./loading";
import SegmentedControl from "./segmented-control";
import TimeRow from "./time-row";

const FREQUENCY_OPTIONS: { label: string; value: WeighInFrequency }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

// The on/off switches of each preferences endpoint.
type ReminderSwitch =
  | "mealRemindersEnabled"
  | "dailyTargetNudgeEnabled"
  | "weighInReminderEnabled"
  | "weeklySummaryEnabled"
  | "targetUpdateAlertsEnabled"
  | "milestoneAlertsEnabled";
type DeliverySwitch = "quietHoursEnabled" | "reEngagementEnabled";

// Why turning push on didn't work, when it's worth saying.
const PUSH_FAILURES: Partial<
  Record<PushRegistrationResult, { message: string; description: string }>
> = {
  denied: {
    message: "Notifications not allowed",
    description: "Allow notifications to get reminders on this phone.",
  },
  blocked: {
    message: "Notifications are off for umbii",
    description: "Turn them on in your phone's settings.",
  },
  unavailable: {
    message: "Push isn't available here",
    description:
      "Notifications need a real device with this app's push set up.",
  },
};

// Push on/off for this phone, and the reminders the server sends (saved to
// the account). Every change saves straight away.
export default function Notifications() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);
  const {
    pushDeviceId,
    reminderPreferences: reminders,
    notificationPreferences: delivery,
    enablePush,
    disablePush,
    fetchPreferences,
    updateReminderPreferences,
    updateNotificationPreferences,
  } = useNotificationsActionsHook();

  const { isInitialLoad, hasError, isRetrying, retry } = useInitialLoad(
    () => fetchPreferences(user.id),
    !!user.id,
  );

  // The switch shows where it's going while the OS prompt / request runs.
  const [pendingPush, setPendingPush] = useState<boolean | null>(null);
  const isPushOn = pendingPush ?? pushDeviceId !== null;

  const togglePush = async (on: boolean) => {
    // One request at a time: overlapping register / unregister calls race
    // on the server.
    if (pendingPush !== null) return;
    setPendingPush(on);
    try {
      if (!on) {
        await disablePush(user.id);
        return;
      }
      const result = await enablePush(user.id);
      const failure = PUSH_FAILURES[result];
      if (failure) {
        errorToast(failure.message, {
          id: "push-toggle",
          description: failure.description,
          action:
            result === "blocked"
              ? { label: "Settings", onPress: () => Linking.openSettings() }
              : undefined,
        });
      }
    } catch (error) {
      reportRequestError("Push toggle failed:", error);
      if (!isUnauthorizedError(error)) {
        errorToast("Couldn't update notifications", {
          id: "push-toggle",
          description: getErrorMessage(error),
        });
      }
    } finally {
      setPendingPush(null);
    }
  };

  const showSaveError = (error: unknown) => {
    if (isUnauthorizedError(error)) return;
    errorToast("Couldn't save that change", {
      id: "notification-preferences",
      description: getErrorMessage(error),
    });
  };

  // The server keeps these apart: which reminders and when (reminder
  // preferences) vs how they're delivered (quiet hours, come-back).
  const save = (changes: ReminderPreferenceChanges) =>
    updateReminderPreferences(user.id, changes).catch(showSaveError);
  const saveDelivery = (changes: NotificationPreferenceChanges) =>
    updateNotificationPreferences(user.id, changes).catch(showSaveError);

  const toggle = (key: ReminderSwitch) => ({
    value: !!reminders?.[key],
    onChange: (value: boolean) => save({ [key]: value }),
  });
  const toggleDelivery = (key: DeliverySwitch) => ({
    value: !!delivery?.[key],
    onChange: (value: boolean) => saveDelivery({ [key]: value }),
  });

  return (
    <View>
      <PageHeader title="Notifications" onBack={() => router.back()} />

      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <View className="gap-2">
          <SettingsGroup>
            <SettingsRow
              icon={BellRinging}
              label="Push notifications"
              toggle={{ value: isPushOn, onChange: togglePush }}
              isLoading={pendingPush !== null}
            />
          </SettingsGroup>
          {/* The reminders below are saved to the account either way; this
              phone just won't get them while push is off. */}
          {!isPushOn && (
            <Text className="px-1 text-xs text-muted-foreground">
              Push is off on this phone. Your choices below are kept for when
              you turn it on.
            </Text>
          )}
        </View>

        {isInitialLoad ? (
          <NotificationsSkeleton />
        ) : hasError || !reminders || !delivery ? (
          <ErrorState
            title="Couldn't load your reminders"
            onRetry={retry}
            isRetrying={isRetrying}
          />
        ) : (
          <>
            <SettingsGroup title="Meals">
              <SettingsRow
                icon={ForkKnife}
                label="Meal reminders"
                toggle={toggle("mealRemindersEnabled")}
              />
              {reminders.mealRemindersEnabled && (
                <TimeRow
                  icon={Coffee}
                  label="Breakfast"
                  value={reminders.breakfastReminderTime}
                  onChange={(time) => save({ breakfastReminderTime: time })}
                />
              )}
              {reminders.mealRemindersEnabled && (
                <TimeRow
                  icon={Sun}
                  label="Lunch"
                  value={reminders.lunchReminderTime}
                  onChange={(time) => save({ lunchReminderTime: time })}
                />
              )}
              {reminders.mealRemindersEnabled && (
                <TimeRow
                  icon={SunHorizon}
                  label="Dinner"
                  value={reminders.dinnerReminderTime}
                  onChange={(time) => save({ dinnerReminderTime: time })}
                />
              )}
            </SettingsGroup>

            <SettingsGroup title="Daily goal">
              <SettingsRow
                icon={Target}
                label="Daily goal nudge"
                toggle={toggle("dailyTargetNudgeEnabled")}
              />
              {reminders.dailyTargetNudgeEnabled && (
                <TimeRow
                  icon={Clock}
                  label="Time"
                  value={reminders.dailyTargetNudgeTime}
                  onChange={(time) => save({ dailyTargetNudgeTime: time })}
                />
              )}
            </SettingsGroup>

            <SettingsGroup title="Weigh-in">
              <SettingsRow
                icon={Scales}
                label="Weigh-in reminder"
                toggle={toggle("weighInReminderEnabled")}
              />
              {reminders.weighInReminderEnabled && (
                <SettingsRow
                  icon={Repeat}
                  label="Repeat"
                  accessory={
                    <SegmentedControl
                      options={FREQUENCY_OPTIONS}
                      value={reminders.weighInFrequency}
                      onChange={(weighInFrequency) =>
                        save({ weighInFrequency })
                      }
                    />
                  }
                />
              )}
              {reminders.weighInReminderEnabled &&
                reminders.weighInFrequency === "weekly" && (
                  <DayPicker
                    value={reminders.weighInDayOfWeek}
                    onChange={(weighInDayOfWeek) => save({ weighInDayOfWeek })}
                  />
                )}
              {reminders.weighInReminderEnabled && (
                <TimeRow
                  icon={Clock}
                  label="Time"
                  value={reminders.weighInReminderTime}
                  onChange={(time) => save({ weighInReminderTime: time })}
                />
              )}
            </SettingsGroup>

            <SettingsGroup title="Updates">
              <SettingsRow
                icon={ChartBar}
                label="Weekly summary"
                toggle={toggle("weeklySummaryEnabled")}
              />
              <SettingsRow
                icon={ArrowsClockwise}
                label="Plan updates"
                toggle={toggle("targetUpdateAlertsEnabled")}
              />
              <SettingsRow
                icon={Trophy}
                label="Milestones"
                toggle={toggle("milestoneAlertsEnabled")}
              />
              <SettingsRow
                icon={HandWaving}
                label="Come-back reminders"
                toggle={toggleDelivery("reEngagementEnabled")}
              />
            </SettingsGroup>

            <SettingsGroup title="Quiet hours">
              <SettingsRow
                icon={MoonStars}
                label="Quiet hours"
                toggle={toggleDelivery("quietHoursEnabled")}
              />
              {delivery.quietHoursEnabled && (
                <TimeRow
                  icon={Moon}
                  label="From"
                  value={delivery.quietHoursStart}
                  onChange={(time) => saveDelivery({ quietHoursStart: time })}
                />
              )}
              {delivery.quietHoursEnabled && (
                <TimeRow
                  icon={Sun}
                  label="Until"
                  value={delivery.quietHoursEnd}
                  onChange={(time) => saveDelivery({ quietHoursEnd: time })}
                />
              )}
            </SettingsGroup>

            <Text className="px-1 text-xs text-muted-foreground">
              Times follow your phone&apos;s time zone
              {reminders.timezone ? ` (${reminders.timezone})` : ""}. Nothing
              is sent during quiet hours.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
