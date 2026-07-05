import { THEME } from "@/lib/theme";
import { Stack, Tabs } from "expo-router";
import { ChartPie, Home, Utensils } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            borderTopWidth: 1,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => <Home color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="log-food"
          options={{
            tabBarIcon: ({ color }) => <Utensils color={color} size={20} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            tabBarIcon: ({ color }) => <ChartPie color={color} size={20} />,
          }}
        />
      </Tabs>
    </>
  );
}
