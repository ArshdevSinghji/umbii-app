import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { Text } from "@/components/ui/text";
import { usePreferencesActionsHook } from "@/features/preferences/preferences.hooks";
import { ColorSchemePreference } from "@/features/preferences/preferences.types";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Bell } from "phosphor-react-native/src/icons/Bell";
import { ChartBar } from "phosphor-react-native/src/icons/ChartBar";
import { Envelope } from "phosphor-react-native/src/icons/Envelope";
import { FileText } from "phosphor-react-native/src/icons/FileText";
import { Info } from "phosphor-react-native/src/icons/Info";
import { Lock } from "phosphor-react-native/src/icons/Lock";
import { PencilSimple } from "phosphor-react-native/src/icons/PencilSimple";
import { Ruler } from "phosphor-react-native/src/icons/Ruler";
import { Scales } from "phosphor-react-native/src/icons/Scales";
import { ShieldCheck } from "phosphor-react-native/src/icons/ShieldCheck";
import { useState } from "react";
import { Pressable, View } from "react-native";

const THEME_OPTIONS: { label: string; value: ColorSchemePreference }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

// App settings. Real: theme, units shown, email, version. Notification
// switches flip but aren't saved yet (no reminders backend); "Soon" rows
// are placeholders.
export default function Settings() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);
  const { colorSchemePreference, updateColorScheme } =
    usePreferencesActionsHook();

  // Placeholders until reminders exist.
  const [mealReminders, setMealReminders] = useState(true);
  const [weighInReminder, setWeighInReminder] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);

  const version = Constants.expoConfig?.version ?? "-";

  return (
    <View>
      <PageHeader title="Settings" onBack={() => router.back()} />

      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <SettingsGroup title="Appearance">
          {/* Same preference as the theme in Home's profile menu. */}
          <View className="min-h-14 flex-row items-center gap-3 px-3 py-2">
            <Text className="flex-1 text-sm">Theme</Text>
            <View className="flex-row gap-1 rounded-full bg-muted p-1">
              {THEME_OPTIONS.map(({ label, value }) => {
                const isSelected = value === colorSchemePreference;
                return (
                  <Pressable
                    key={value}
                    onPress={() => updateColorScheme(value)}
                    className={cn(
                      "rounded-full px-3 py-1.5 active:opacity-70",
                      isSelected && "bg-background",
                    )}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      className={cn(
                        "text-xs",
                        isSelected ? "font-sans-bold" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <SettingsRow icon={Ruler} label="Units" value="Metric (kg, cm)" />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsRow
            icon={Bell}
            label="Meal reminders"
            toggle={{ value: mealReminders, onChange: setMealReminders }}
          />
          <SettingsRow
            icon={Scales}
            label="Weigh-in reminder"
            toggle={{ value: weighInReminder, onChange: setWeighInReminder }}
          />
          <SettingsRow
            icon={ChartBar}
            label="Weekly summary"
            toggle={{ value: weeklySummary, onChange: setWeeklySummary }}
          />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsRow icon={Envelope} label="Email" value={user.email} />
          <SettingsRow icon={PencilSimple} label="Edit profile" comingSoon />
          <SettingsRow icon={Lock} label="Privacy" comingSoon />
        </SettingsGroup>

        <SettingsGroup title="About">
          <SettingsRow icon={FileText} label="Terms of service" comingSoon />
          <SettingsRow icon={ShieldCheck} label="Privacy policy" comingSoon />
          <SettingsRow icon={Info} label="Version" value={version} />
        </SettingsGroup>
      </View>
    </View>
  );
}
