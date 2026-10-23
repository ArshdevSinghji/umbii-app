import { KeyboardProvider } from "react-native-keyboard-controller";
import AppTheme from "@/components/app-theme";
import { errorToast } from "@/components/ui/app-toaster";
import { eventBus } from "@/lib/event-bus";
import type { SignOutReason } from "@/lib/http-client";
import { showNotificationsInForeground } from "@/lib/push-notifications";
import { useAuth } from "@/lib/use-auth";
import { loadColorSchemePreference } from "@/features/preferences/preferences.storage";
import { setColorSchemePreference } from "@/features/preferences/preferences.slice";
import { store } from "@/store/store";
import StoreProvider from "@/store/store-provider";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import "../global.css";

showNotificationsInForeground();

const SIGN_OUT_NOTES: Record<
  SignOutReason,
  { message: string; description: string }
> = {
  "session-ended": {
    message: "You were signed out",
    description: "This account signed in on another device.",
  },
  expired: {
    message: "Your session expired",
    description: "Sign in again to continue.",
  },
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { token, isLoading: authLoading } = useAuth();

  // The saved theme, applied before the first frame so it doesn't flash.
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  useEffect(() => {
    loadColorSchemePreference()
      .then((preference) => {
        if (preference) store.dispatch(setColorSchemePreference(preference));
      })
      .finally(() => setPreferencesLoaded(true));
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    "Caudex-Regular": require("../../assets/fonts/Caudex-Regular.ttf"),
    "Caudex-Bold": require("../../assets/fonts/Caudex-Bold.ttf"),
    "Caudex-Italic": require("../../assets/fonts/Caudex-Italic.ttf"),
    "Caudex-BoldItalic": require("../../assets/fonts/Caudex-BoldItalic.ttf"),
  });

  const appReady =
    (fontsLoaded || !!fontError) && !authLoading && preferencesLoaded;

  // splash (theme is applied by <AppTheme /> from the saved preference)
  useEffect(() => {
    if (!appReady) return;
    SplashScreen.hideAsync();
  }, [appReady]);

  // Say why the user is back on sign-in. Concurrent requests can all fail
  // at once, so the fixed id shows the note once.
  useEffect(() => {
    const onUnauthorized = ({ reason }: { reason?: SignOutReason }) => {
      if (!reason) return;
      const { message, description } = SIGN_OUT_NOTES[reason];
      errorToast(message, { id: "signed-out", description });
    };
    eventBus.on("auth:unauthorized", onUnauthorized);
    return () => {
      eventBus.off("auth:unauthorized", onUnauthorized);
    };
  }, []);

  // route protection — single effect, single source of truth
  useEffect(() => {
    if (!appReady) return;

    const inAuthGroup = segments[0] === "(sign-in)";

    if (!token && !inAuthGroup) router.replace("/(sign-in)");
    else if (token && inAuthGroup) router.replace("/(tabs)/home");
  }, [token, appReady, segments]);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Real insets from the first frame, so screens don't jump once they arrive. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        {/* Keyboard insets for edge-to-edge Android (and modals), where the
            built-in KeyboardAvoidingView / adjustResize no longer work. */}
        <KeyboardProvider>
          <StoreProvider>
            <AppTheme>
              <Stack />
              <PortalHost />
            </AppTheme>
          </StoreProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
