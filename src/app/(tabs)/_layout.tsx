import { Text } from "@/components/ui/text";
import {
  FLOATING_TAB_BAR_BOTTOM_MARGIN,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/lib/floating-tab-bar";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Stack } from "expo-router";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import { ChartPie, Home, Mic, Utensils } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

function FloatingTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 0.5,
  };

  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        start: 24,
        end: 24,
        bottom: insets.bottom + FLOATING_TAB_BAR_BOTTOM_MARGIN,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: FLOATING_TAB_BAR_HEIGHT,
          borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
          borderWidth: 0,
          borderColor: theme.border,
          backgroundColor: theme.card,
          paddingHorizontal: 6,
          ...shadow,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? theme.primary : theme.mutedForeground;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className={cn(
                "flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2.5",
                focused && "bg-secondary",
              )}
            >
              {options.tabBarIcon?.({ focused, color, size: 18 })}
              <Text style={{ color }} className="text-[10px] font-medium">
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => {
          const logFoodRoute = state.routes.find((r) => r.name === "log-food");
          if (logFoodRoute) {
            navigation.navigate(logFoodRoute.name, logFoodRoute.params);
          }
        }}
        className="items-center justify-center rounded-full"
        style={{
          width: FLOATING_TAB_BAR_HEIGHT,
          height: FLOATING_TAB_BAR_HEIGHT,
          borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
          backgroundColor: theme.foreground,
          ...shadow,
        }}
      >
        <Mic color={theme.background} size={22} />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="log-food"
          options={{
            title: "Log Food",
            tabBarIcon: ({ color, size }) => (
              <Utensils color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color, size }) => (
              <ChartPie color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
