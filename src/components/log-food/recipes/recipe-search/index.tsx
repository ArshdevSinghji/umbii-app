import { Input } from "@/components/ui/input";
import { THEME } from "@/lib/theme";
import { MagnifyingGlass } from "phosphor-react-native/src/icons/MagnifyingGlass";
import { X } from "phosphor-react-native/src/icons/X";
import { useColorScheme } from "nativewind";
import { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

// A pill with the magnifier in its own round chip on the left, a borderless
// input beside it and a clear button on the right. Tapping anywhere on the
// pill (e.g. the chip) focuses the input.
export default function RecipeSearch({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className="h-12 flex-row items-center gap-2 rounded-full border border-input bg-background pl-1.5 pr-4 dark:bg-input/30"
      accessible={false}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
        <MagnifyingGlass size={16} color={theme.foreground} />
      </View>
      <Input
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        placeholder="MagnifyingGlass recipes..."
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        className="h-full flex-1 border-0 bg-transparent px-0 dark:bg-transparent"
        accessibilityLabel="MagnifyingGlass recipes"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChange("")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={16} color={theme.mutedForeground} />
        </Pressable>
      )}
    </Pressable>
  );
}
