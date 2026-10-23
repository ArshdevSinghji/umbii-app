import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { useAppSelector } from "@/store/hooks";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Bell } from "phosphor-react-native/src/icons/Bell";
import { Envelope } from "phosphor-react-native/src/icons/Envelope";
import { FileText } from "phosphor-react-native/src/icons/FileText";
import { Info } from "phosphor-react-native/src/icons/Info";
import { Lock } from "phosphor-react-native/src/icons/Lock";
import { PencilSimple } from "phosphor-react-native/src/icons/PencilSimple";
import { Ruler } from "phosphor-react-native/src/icons/Ruler";
import { ShieldCheck } from "phosphor-react-native/src/icons/ShieldCheck";
import { View } from "react-native";

// App settings. Real: units shown, email, version, and the way to
// notifications; "Soon" rows are placeholders.
export default function Settings() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);

  const version = Constants.expoConfig?.version ?? "-";

  return (
    <View>
      <PageHeader title="Settings" onBack={() => router.back()} />

      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <SettingsGroup title="Preferences">
          <SettingsRow icon={Ruler} label="Units" value="Metric (kg, cm)" />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsRow
            icon={Bell}
            label="Reminders and alerts"
            onPress={() => router.push("/notifications")}
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
