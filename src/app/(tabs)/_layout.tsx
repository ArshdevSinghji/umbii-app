import { CARD_GRADIENT } from "@/components/ui/gradient-card";
import { Text } from "@/components/ui/text";
import {
  FLOATING_TAB_BAR_BOTTOM_MARGIN,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/lib/floating-tab-bar";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
// Phosphor, imported one icon at a time (the package root bundles all of
// them): each has an outline and a filled weight, so the active tab is
// filled and the rest are outlines.
import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { ChartBar } from "phosphor-react-native/src/icons/ChartBar";
import { ForkKnife } from "phosphor-react-native/src/icons/ForkKnife";
import { House } from "phosphor-react-native/src/icons/House";
import { Target } from "phosphor-react-native/src/icons/Target";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

const TABS: {
  name: string;
  title: string;
  icon: PhosphorIcon;
}[] = [
  // Labels describe what each tab shows; route names stay as they are.
  { name: "home", title: "Home", icon: House },
  // Calories and nutrients by day / week / month / year.
  { name: "breakdown", title: "Stats", icon: ChartBar },
  { name: "log-food", title: "Log Food", icon: ForkKnife },
  // Weight and goal progress.
  { name: "stats", title: "Goals", icon: Target },
];

function FloatingTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const gradient = CARD_GRADIENT[colorScheme ?? "light"];
  // Soft tint for the active tab, so it sits on the gradient rather than
  // covering it with a flat block.
  const activeTint =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.05)";

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
          // Same gradient and hairline outline as the headline cards.
          borderWidth: 1,
          borderColor: gradient.border,
          backgroundColor: gradient.colors[1],
          paddingHorizontal: 6,
          paddingVertical: 6,
          ...shadow,
        }}
      >
        {/* Rounded itself rather than clipping the bar: overflow "hidden"
            would also clip the shadow on iOS. */}
        <LinearGradient
          colors={gradient.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: FLOATING_TAB_BAR_HEIGHT / 2 - 1,
          }}
        />
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
              className="flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2.5"
              style={focused ? { backgroundColor: activeTint } : undefined}
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
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  // Our tab bar always passes a theme colour string.
                  color={color as string}
                  size={22}
                  weight={focused ? "fill" : "regular"}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
