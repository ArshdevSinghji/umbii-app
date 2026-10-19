import { ActionButton } from "@/components/ui/action-button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface IProps {
  label: string;
  onPress: () => void;
  // Shown above a disabled button, saying what's still missing.
  hint?: string;
  disabled?: boolean;
  // Spinner in the button while a request runs.
  isLoading?: boolean;
  // Why the last request failed; takes the hint's place, in red.
  error?: string | null;
}

// The step's main button, with the "Pick … to continue" hint over it. The
// hint keeps its line even when hidden, so the button never moves.
export default function OnboardingFooter({
  label,
  onPress,
  hint,
  disabled = false,
  isLoading = false,
  error,
}: IProps) {
  return (
    <View className="gap-3">
      {error ? (
        <Text className="text-center text-xs text-destructive">{error}</Text>
      ) : (
        <Text
          className="text-center text-xs text-muted-foreground"
          style={{ opacity: disabled && hint ? 1 : 0 }}
        >
          {hint ?? " "}
        </Text>
      )}
      <ActionButton
        label={label}
        onPress={onPress}
        disabled={disabled}
        isLoading={isLoading}
      />
    </View>
  );
}
