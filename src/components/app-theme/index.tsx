import { usePreferencesActionsHook } from "@/features/preferences/preferences.hooks";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ReactNode, useEffect } from "react";

interface IProps {
  children: ReactNode;
}

// Applies the saved Light / Dark / System preference to NativeWind, the
// navigation theme and the status bar. Must sit inside the store provider.
export default function AppTheme({ children }: IProps) {
  const { colorSchemePreference } = usePreferencesActionsHook();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(colorSchemePreference);
  }, [colorSchemePreference, setColorScheme]);

  // NativeWind resolves "system" to the device's actual scheme.
  const resolved = colorScheme === "dark" ? "dark" : "light";

  return (
    <ThemeProvider value={NAV_THEME[resolved]}>
      <StatusBar style={resolved === "dark" ? "light" : "dark"} />
      {children}
    </ThemeProvider>
  );
}
