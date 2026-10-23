import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";
import { usePreferencesActionsHook } from "@/features/preferences/preferences.hooks";
import { ColorSchemePreference } from "@/features/preferences/preferences.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { CircleHalf } from "phosphor-react-native/src/icons/CircleHalf";
import { Moon } from "phosphor-react-native/src/icons/Moon";
import { Sun } from "phosphor-react-native/src/icons/Sun";
import { useState } from "react";
import { Pressable, View } from "react-native";

const THEME_OPTIONS: {
  value: ColorSchemePreference;
  label: string;
  short: string;
  icon: PhosphorIcon;
}[] = [
  { value: "light", label: "Light theme", short: "Light", icon: Sun },
  { value: "dark", label: "Dark theme", short: "Dark", icon: Moon },
  { value: "system", label: "System theme", short: "System", icon: CircleHalf },
];

const isColorSchemePreference = (
  value: string,
): value is ColorSchemePreference =>
  THEME_OPTIONS.some((option) => option.value === value);

// Theme picker as one card: collapsed it shows the current choice; tapped,
// it opens into a row per theme with a radio.
export default function AppearanceCard() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { colorSchemePreference, updateColorScheme } =
    usePreferencesActionsHook();

  const [openItem, setOpenItem] = useState<string | undefined>();
  const isOpen = openItem === "appearance";

  const selected =
    THEME_OPTIONS.find((option) => option.value === colorSchemePreference) ??
    THEME_OPTIONS[2];

  return (
    <View className="overflow-hidden rounded-2xl bg-card">
      {/* Uncontrolled on purpose: the primitive reads `value={undefined}` as
          "uncontrolled" and falls back to its own (still open) state, so a
          controlled close took two taps. We only listen to know if it's open. */}
      <Accordion type="single" collapsible onValueChange={setOpenItem}>
        <AccordionItem value="appearance" className="border-b-0">
          <AccordionTrigger className="min-h-14 items-center px-3 py-2">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="size-8 items-center justify-center rounded-lg bg-muted">
                <selected.icon size={18} color={theme.foreground} />
              </View>
              <Text className="flex-1 text-sm font-normal">Appearance</Text>
              {/* The open list already shows the choice. */}
              {!isOpen && (
                <Text className="text-sm text-muted-foreground">
                  {selected.short}
                </Text>
              )}
            </View>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <RadioGroup
              value={colorSchemePreference}
              onValueChange={(value) => {
                if (isColorSchemePreference(value)) updateColorScheme(value);
              }}
              className="gap-0"
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <View key={value}>
                  <View className="ml-14 h-px bg-border" />
                  {/* The whole row picks the theme, not just the radio. */}
                  <Pressable
                    onPress={() => updateColorScheme(value)}
                    className="min-h-12 flex-row items-center gap-3 px-3 py-2 active:bg-muted"
                    accessibilityRole="radio"
                    accessibilityState={{
                      checked: value === colorSchemePreference,
                    }}
                  >
                    <View className="size-8 items-center justify-center">
                      <Icon size={18} color={theme.foreground} />
                    </View>
                    <Text className="flex-1 text-sm">{label}</Text>
                    <RadioGroupItem
                      value={value}
                      aria-labelledby={label}
                      className="size-5"
                    />
                  </Pressable>
                </View>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
