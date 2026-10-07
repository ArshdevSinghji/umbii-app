import AppTheme from "@/components/app-theme";
import { useAuth } from "@/lib/use-auth";
import StoreProvider from "@/store/store-provider";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { token, isLoading: authLoading } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    "Caudex-Regular": require("../../assets/fonts/Caudex-Regular.ttf"),
    "Caudex-Bold": require("../../assets/fonts/Caudex-Bold.ttf"),
    "Caudex-Italic": require("../../assets/fonts/Caudex-Italic.ttf"),
    "Caudex-BoldItalic": require("../../assets/fonts/Caudex-BoldItalic.ttf"),
  });

  const appReady = (fontsLoaded || !!fontError) && !authLoading;

  // splash (theme is applied by <AppTheme /> from the saved preference)
  useEffect(() => {
    if (!appReady) return;
    SplashScreen.hideAsync();
  }, [appReady]);

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
        <StoreProvider>
          <AppTheme>
            <Stack />
            <PortalHost />
          </AppTheme>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
