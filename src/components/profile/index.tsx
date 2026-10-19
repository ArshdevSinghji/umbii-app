import { getAge } from "@/components/onboarding/onboarding.utils";
import { useSignOut } from "@/components/home/hooks/use-sign-out";
import PageHeader from "@/components/settings-list/page-header";
import SettingsGroup from "@/components/settings-list/settings-group";
import SettingsRow from "@/components/settings-list/settings-row";
import { errorToast } from "@/components/ui/app-toaster";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { useUserActionsHook } from "@/features/user/user.hook";
import { DietType, GoalType } from "@/features/user/user.types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/http-client";
import { useRefresh } from "@/lib/pull-to-refresh";
import { useRouter } from "expo-router";
import { ArrowsClockwise } from "phosphor-react-native/src/icons/ArrowsClockwise";
import { Bell } from "phosphor-react-native/src/icons/Bell";
import { Calendar } from "phosphor-react-native/src/icons/Calendar";
import { ClipboardText } from "phosphor-react-native/src/icons/ClipboardText";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { GearSix } from "phosphor-react-native/src/icons/GearSix";
import { Leaf } from "phosphor-react-native/src/icons/Leaf";
import { Question } from "phosphor-react-native/src/icons/Question";
import { Ruler } from "phosphor-react-native/src/icons/Ruler";
import { Scales } from "phosphor-react-native/src/icons/Scales";
import { SignOut } from "phosphor-react-native/src/icons/SignOut";
import { Target } from "phosphor-react-native/src/icons/Target";
import { UserPlus } from "phosphor-react-native/src/icons/UserPlus";
import { Alert, Share, View } from "react-native";
import ProfileHeader from "./profile-header";

// The app's Play Store page (package com.umbii); live once published.
const INVITE_URL = "https://play.google.com/store/apps/details?id=com.umbii";

const GOAL_LABELS: Record<GoalType, string> = {
  [GoalType.FatLoss]: "Lose fat",
  [GoalType.Maintenance]: "Maintain",
  [GoalType.Hypertrophy]: "Build muscle",
};

const DIET_LABELS: Record<DietType, string> = {
  [DietType.Vegetarian]: "Vegetarian",
  [DietType.Eggetarian]: "Eggetarian",
  [DietType.NonVeg]: "Non-veg",
  [DietType.Vegan]: "Vegan",
  [DietType.Jain]: "Jain",
  [DietType.Halal]: "Halal",
};

// The Profile tab: who you are, the plan your answers produced, and the
// way to settings and out.
export default function Profile() {
  const router = useRouter();
  const { user, profile, fetchUser } = useUserActionsHook();
  const { nutritionTarget, isGenerating, generateNutritionTarget } =
    useNutritionTargetActionsHook();
  const { signOut } = useSignOut();

  useRefresh(() => fetchUser(user.id));

  // Works out a new target from the profile and the latest weigh-in, e.g.
  // after a few weigh-ins. Home's target updates from the response.
  const recalculate = async () => {
    try {
      await generateNutritionTarget(user.id);
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        errorToast("Couldn't recalculate your plan", {
          description: getErrorMessage(error),
        });
      }
    }
  };

  // The phone's share sheet (WhatsApp, messages, ...) with an invite.
  // Referral codes and rewards would need the backend; this only shares.
  const inviteFriend = () =>
    Share.share({
      message: `I'm tracking my meals and goals with umbii. Join me: ${INVITE_URL}`,
    }).catch(() => {
      // Closing the sheet isn't an error worth showing.
    });

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You can sign back in with Google anytime.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);

  const isMaintaining = profile?.goalType === GoalType.Maintenance;
  // "-0.5 kg/week", signed for loss.
  const pace =
    profile?.weeklyRateKg != null
      ? `${profile.weeklyRateKg > 0 ? "+" : ""}${profile.weeklyRateKg} kg/week`
      : undefined;

  return (
    <View>
      <PageHeader title="Profile">
        <ProfileHeader />
      </PageHeader>

      {/* The sheet overlaps the band's bottom edge. */}
      <View className="-mt-6 gap-6 rounded-t-3xl bg-background px-4 pt-6">
        <SettingsGroup title="Your plan">
          <SettingsRow
            icon={Target}
            label="Goal"
            value={profile ? GOAL_LABELS[profile.goalType] : "-"}
          />
          {!isMaintaining && (
            <SettingsRow
              icon={Scales}
              label="Target weight"
              value={
                profile?.targetWeightKg != null
                  ? `${profile.targetWeightKg} kg`
                  : "-"
              }
            />
          )}
          {pace && <SettingsRow icon={Scales} label="Pace" value={pace} />}
          <SettingsRow
            icon={Fire}
            label="Daily target"
            value={
              nutritionTarget
                ? `${Math.round(nutritionTarget.calories).toLocaleString()} kcal`
                : "-"
            }
          />
          <SettingsRow
            icon={Ruler}
            label="Height"
            value={profile ? `${profile.heightCm} cm` : "-"}
          />
          <SettingsRow
            icon={Calendar}
            label="Age"
            value={profile ? `${getAge(profile.dateOfBirth)}` : "-"}
          />
          <SettingsRow
            icon={Leaf}
            label="Diet"
            value={profile ? DIET_LABELS[profile.dietType] : "-"}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow
            icon={ArrowsClockwise}
            label="Recalculate my plan"
            onPress={recalculate}
            isLoading={isGenerating}
          />
          <SettingsRow
            icon={ClipboardText}
            label="Redo onboarding"
            onPress={() => router.push("/onboarding")}
          />
        </SettingsGroup>

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
          <SettingsRow icon={Bell} label="Notifications" comingSoon />
          <SettingsRow icon={Question} label="Help and support" comingSoon />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow
            icon={SignOut}
            label="Sign out"
            destructive
            onPress={confirmSignOut}
          />
        </SettingsGroup>
      </View>
    </View>
  );
}
