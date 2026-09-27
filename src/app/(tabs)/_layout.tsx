import { Text } from "@/components/ui/text";
import {
  FLOATING_TAB_BAR_BOTTOM_MARGIN,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/lib/floating-tab-bar";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Stack } from "expo-router";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import {
  ChartPie,
  Home,
  Rows3,
  Utensils,
  type LucideIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

const TABS: {
  name: string;
  title: string;
  icon: LucideIcon;
}[] = [
  { name: "home", title: "Home", icon: Home },
  { name: "breakdown", title: "Breakdown", icon: Rows3 },
  { name: "log-food", title: "Log Food", icon: Utensils },
  { name: "stats", title: "Stats", icon: ChartPie },
];

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
        start: 24,
        end: 24,
        bottom: insets.bottom + FLOATING_TAB_BAR_BOTTOM_MARGIN,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: FLOATING_TAB_BAR_HEIGHT,
          borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
          borderWidth: 0,
          borderColor: theme.border,
          backgroundColor: theme.card,
          paddingHorizontal: 6,
          paddingVertical: 6,
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
        {TABS.map(({ name, title, icon: Icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color, size }) => (
                <Icon color={color} size={size} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
