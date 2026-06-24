import { Stack, ThemeProvider } from "expo-router";

import "../global.css";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/theme";

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME['light']}>
      <StatusBar style="dark" />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}