import { NAV_THEME } from "@/lib/theme";
import { useAuth } from "@/lib/use-auth";
import StoreProvider from "@/store/store-provider";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
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

  // splash + theme
  useEffect(() => {
    if (!appReady) return;
    SplashScreen.hideAsync();
    setColorScheme("light");
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
    <SafeAreaProvider>
      <StoreProvider>
        <ThemeProvider value={NAV_THEME["light"]}>
          <StatusBar style="dark" />
          <Stack />
          <PortalHost />
        </ThemeProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
