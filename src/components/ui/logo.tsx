import { useColorScheme } from "nativewind";
import { View } from "react-native";
import LogoMark, { LOGO_INK } from "./logo-mark";
import { Text } from "./text";

// Lockup sizes from the logo design: lg = hero (mark 128, wordmark 60),
// md = banner (56 / 40). sm is the same proportions for compact headers.
const SIZES = {
  lg: { mark: 128, text: 60, gap: 22 },
  md: { mark: 56, text: 40, gap: 14 },
  sm: { mark: 32, text: 24, gap: 8 },
};

interface IProps {
  size?: keyof typeof SIZES;
}

// Mark + "umbii" wordmark (Caudex regular, slight tracking), side by side.
export default function Logo({ size = "md" }: IProps) {
  const { colorScheme } = useColorScheme();
  const { mark, text, gap } = SIZES[size];

  return (
    <View className="flex-row items-center" style={{ gap }}>
      <LogoMark size={mark} />
      <Text
        className="font-sans"
        style={{
          fontSize: text,
          lineHeight: text * 1.2,
          letterSpacing: text * 0.01,
          color: LOGO_INK[colorScheme ?? "light"],
        }}
      >
        umbii
      </Text>
    </View>
  );
}
