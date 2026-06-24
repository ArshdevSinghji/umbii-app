import { SplashScreen, Stack, ThemeProvider } from "expo-router";

import { NAV_THEME } from "@/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    "Caudex-Regular": require("../../assets/fonts/Caudex-Regular.ttf"),
    "Caudex-Bold": require("../../assets/fonts/Caudex-Bold.ttf"),
    "Caudex-Italic": require("../../assets/fonts/Caudex-Italic.ttf"),
    "Caudex-BoldItalic": require("../../assets/fonts/Caudex-BoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }

    setColorScheme("light");
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider value={NAV_THEME["light"]}>
      <StatusBar style="dark" />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
