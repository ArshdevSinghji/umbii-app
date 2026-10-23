import { useSignOut } from "@/components/home/hooks/use-sign-out";
import { errorToast } from "@/components/ui/app-toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getErrorMessage, isUnauthorizedError } from "@/lib/http-client";
import { useState } from "react";
import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { useUserActionsHook } from "@/features/user/user.hook";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useRouter } from "expo-router";
import { Bell } from "phosphor-react-native/src/icons/Bell";
import { GearSix } from "phosphor-react-native/src/icons/GearSix";
import { Question } from "phosphor-react-native/src/icons/Question";
import { SignOut } from "phosphor-react-native/src/icons/SignOut";
import { Target } from "phosphor-react-native/src/icons/Target";
import { Trash } from "phosphor-react-native/src/icons/Trash";
import { UserPlus } from "phosphor-react-native/src/icons/UserPlus";
import { Share, View } from "react-native";
import AppearanceCard from "./appearance-card";
import ProfileHeader from "./profile-header";

// The app's Play Store page (package com.umbii); live once published.
const INVITE_URL = "https://play.google.com/store/apps/details?id=com.umbii";

// The Profile tab: who you are, the way to your plan and settings, and out
// (sign out, or delete the account).
export default function Profile() {
  const router = useRouter();
  const { user, fetchUser, deleteUser, isDeleting } = useUserActionsHook();
  const { nutritionTarget } = useNutritionTargetActionsHook();
  const { signOut } = useSignOut();

  useRefresh(() => fetchUser(user.id));

  // Deletes the account for good, then signs out (back to sign-in). The
  // dialog asks first, spelling out that it can't be undone.
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteAccount = async () => {
    try {
      await deleteUser(user.id);
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        errorToast("Couldn't delete your account", {
          description: getErrorMessage(error),
        });
      }
      return;
    }
    await signOut();
  };

  // The phone's share sheet (WhatsApp, messages, ...) with an invite.
  // Referral codes and rewards would need the backend; this only shares.
  const inviteFriend = () =>
    Share.share({
      message: `I'm tracking my meals and goals with umbii. Join me: ${INVITE_URL}`,
    }).catch(() => {
      // Closing the sheet isn't an error worth showing.
    });

  return (
    <View>
      <PageHeader title="Profile">
        <ProfileHeader />
      </PageHeader>

      {/* The sheet overlaps the band's bottom edge. */}
      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <SettingsGroup>
          <SettingsRow
            icon={Target}
            label="Your plan"
            value={
              nutritionTarget
                ? `${Math.round(nutritionTarget.calories).toLocaleString()} kcal/day`
                : undefined
            }
            onPress={() => router.push("/plan")}
          />
        </SettingsGroup>

        <AppearanceCard />

        <SettingsGroup>
          <SettingsRow
            icon={UserPlus}
            label="Invite a friend"
            onPress={inviteFriend}
          />
          <SettingsRow
            icon={GearSix}
            label="Settings"
            onPress={() => router.push("/settings")}
          />
          <SettingsRow
            icon={Bell}
            label="Notifications"
            onPress={() => router.push("/notifications")}
          />
          <SettingsRow icon={Question} label="Help and support" comingSoon />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow
            icon={SignOut}
            label="Sign out"
            destructive
            onPress={signOut}
          />
          <SettingsRow
            icon={Trash}
            label="Delete account"
            destructive
            onPress={() => setIsDeleteOpen(true)}
            isLoading={isDeleting}
          />
        </SettingsGroup>
      </View>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete your account?"
        description="This permanently deletes your account, meals, recipes, weigh-ins and plan. It can't be undone."
        confirmLabel="Delete account"
        destructive
        onConfirm={deleteAccount}
      />
    </View>
  );
}
