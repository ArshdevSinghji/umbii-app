import { useUserActionsHook } from "@/features/user/user.hook";
import { reportRequestError } from "@/lib/http-client";
import { useAppSelector } from "@/store/hooks";
import { withMinDuration } from "@/utils/with-min-duration";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// The splash shows at least this long, so the animation reads.
const MIN_SPLASH_MS = 1200;

// First-time users go to onboarding: once per signed-in user, load the
// account (which also refreshes the saved copy) and, if it has no profile
// yet, replace the current screen with onboarding. `isChecking` is true
// meanwhile, for the splash. If loading fails, the app stays usable.
export function useOnboardingGate() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);
  const { fetchUser, profile } = useUserActionsHook();
  // No splash when the profile is already known (e.g. straight after
  // onboarding): it's refreshed quietly instead.
  const [isChecking, setIsChecking] = useState(() => !!user.id && !profile);

  useEffect(() => {
    if (!user.id) return;
    const request = fetchUser(user.id);
    withMinDuration(request, isChecking ? MIN_SPLASH_MS : 0)
      .then((profile) => {
        if (!profile) router.replace("/onboarding");
      })
      .catch((error) => reportRequestError("Error fetching user:", error))
      .finally(() => setIsChecking(false));
    // Once per user; the router and hook functions are stable enough here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return { isChecking };
}
