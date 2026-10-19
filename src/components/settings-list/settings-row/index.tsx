import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { ActivityIndicator, Pressable, View } from "react-native";

interface IProps {
  label: string;
  icon?: PhosphorIcon;
  // Shown on the right, muted (e.g. "185 cm").
  value?: string;
  onPress?: () => void;
  // A switch instead of a chevron.
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  // Red label and icon, e.g. sign out.
  destructive?: boolean;
  // Not built yet: a small "Soon" tag, and it does nothing.
  comingSoon?: boolean;
  isLoading?: boolean;
}

// One row: icon chip, label, then a value and chevron, or a switch. Rows
// without an action show no chevron.
export default function SettingsRow({
  label,
  icon: Icon,
  value,
  onPress,
  toggle,
  destructive = false,
  comingSoon = false,
  isLoading = false,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const color = destructive ? theme.destructive : theme.foreground;
  const isPressable = !!onPress && !comingSoon && !isLoading;

  return (
    <Pressable
      onPress={isPressable ? onPress : undefined}
      disabled={!isPressable && !toggle}
      className="min-h-14 flex-row items-center gap-3 px-3 py-2 active:bg-muted"
      accessibilityRole={toggle ? "switch" : isPressable ? "button" : undefined}
      accessibilityState={
        toggle
          ? { checked: toggle.value }
          : { disabled: comingSoon || undefined }
      }
    >
      {Icon && (
        <View className="size-8 items-center justify-center rounded-lg bg-muted">
          <Icon size={18} color={color} />
        </View>
      )}
      <Text
        className={cn("flex-1 text-sm", destructive && "text-destructive")}
        style={comingSoon ? { opacity: 0.6 } : undefined}
      >
        {label}
      </Text>

      {comingSoon && (
        <View className="rounded-full bg-muted px-2 py-0.5">
          <Text className="text-[10px] text-muted-foreground">Soon</Text>
        </View>
      )}
      {value && !comingSoon && (
        <Text className="text-sm text-muted-foreground" numberOfLines={1}>
          {value}
        </Text>
      )}
      {isLoading && <ActivityIndicator size="small" color={color} />}
      {toggle && (
        <Switch checked={toggle.value} onCheckedChange={toggle.onChange} />
      )}
      {isPressable && !toggle && (
        <CaretRight size={16} color={theme.mutedForeground} />
      )}
    </Pressable>
  );
}
