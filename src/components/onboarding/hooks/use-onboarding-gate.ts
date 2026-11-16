import { useUserActionsHook } from "@/features/user/user.hook";
import { reportRequestError } from "@/lib/http-client";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// First-time users go to onboarding: once per signed-in user, load the
// account and the profile and, if there's no profile yet, replace the
// current screen with onboarding. `isChecking` is true
// meanwhile, for the splash. If loading fails, the app stays usable.
export function useOnboardingGate() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);
  const { fetchUser, fetchProfile, profile } = useUserActionsHook();
  // No splash when the profile is already known (e.g. straight after
  // onboarding): it's refreshed quietly instead.
  const [isChecking, setIsChecking] = useState(() => !!user.id && !profile);

  useEffect(() => {
    if (!user.id) return;
    // Launch only restores the user id; the account fills the Profile tab.
    // It can fail on its own without blocking the gate.
    fetchUser(user.id).catch((error) =>
      reportRequestError("Error fetching user:", error),
    );
    // The loading screen is up only as long as this request takes.
    fetchProfile(user.id)
      .then((profile) => {
        if (!profile) router.replace("/onboarding");
      })
      .catch((error) => reportRequestError("Error fetching profile:", error))
      .finally(() => setIsChecking(false));
    // Once per user; the router and hook functions are stable enough here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return { isChecking };
}
