import { Input } from "@/components/ui/input";
import { THEME } from "@/lib/theme";
import { Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

interface IProps {
  value: string;
  onChange: (value: string) => void;
}

// Search field with a magnifier on the left and a clear button on the right.
export default function RecipeSearch({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="justify-center">
      <View className="absolute left-3 z-10" pointerEvents="none">
        <Search size={16} color={theme.mutedForeground} />
      </View>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder="Search recipes or foods"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        className="h-11 rounded-full pl-9 pr-9"
        accessibilityLabel="Search recipes"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChange("")}
          hitSlop={10}
          className="absolute right-3"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={16} color={theme.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}
