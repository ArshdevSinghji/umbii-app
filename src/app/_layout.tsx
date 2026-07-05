import { eventBus } from "@/lib/event-bus";
import { NAV_THEME } from "@/lib/theme";
import { getToken } from "@/lib/token";
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
import { useEffect, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loaded, error] = useFonts({
    "Caudex-Regular": require("../../assets/fonts/Caudex-Regular.ttf"),
    "Caudex-Bold": require("../../assets/fonts/Caudex-Bold.ttf"),
    "Caudex-Italic": require("../../assets/fonts/Caudex-Italic.ttf"),
    "Caudex-BoldItalic": require("../../assets/fonts/Caudex-BoldItalic.ttf"),
  });

  // load token on mount
  useEffect(() => {
    getToken().then((t) => {
      setToken(t);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      setToken(null);
      router.replace("/(sign-in)");
    };
    eventBus.on("auth:unauthorized", handler);
    return () => {
      eventBus.off("auth:unauthorized", handler);
    };
  }, []);

  useEffect(() => {
    if ((loaded || error) && !authLoading) {
      SplashScreen.hideAsync();
    }
    setColorScheme("light");
  }, [loaded, error, authLoading]);

  useEffect(() => {
    if (authLoading || (!loaded && !error)) return;

    const inAuthGroup = segments[0] === "(sign-in)";

    if (!token && !inAuthGroup) {
      router.replace("/(sign-in)");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [token, authLoading, loaded, error, segments]);

  if ((!loaded && !error) || authLoading) return null;

  return (
    <StoreProvider>
      <ThemeProvider value={NAV_THEME["light"]}>
        <StatusBar style="dark" />
        <Stack />
        <PortalHost />
      </ThemeProvider>
    </StoreProvider>
  );
}
