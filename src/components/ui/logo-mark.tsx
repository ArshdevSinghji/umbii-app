import { Image } from "expo-image";
import { useColorScheme } from "nativewind";

// Brand ink from the logo design (not the theme): a warm off-black /
// off-white. The dots keep their macro colours in both.
export const LOGO_INK = { light: "#0B0B0C", dark: "#F4F3EF" };

// Pre-rendered from assets/brand/mark.svg by scripts/generate-brand-assets.mjs:
// its hand-drawn wobble is an feTurbulence filter, which react-native-svg
// can't draw (it would come out as a clean, smooth "u").
const MARK = {
  light: require("../../../assets/images/logo-mark.png"),
  dark: require("../../../assets/images/logo-mark-dark.png"),
};

interface IProps {
  size: number;
  // Defaults to the current theme; force one for a mark on an inverted
  // surface (e.g. "dark" = light ink, for a dark tile in light mode).
  scheme?: "light" | "dark";
}

// The umbii mark: a doodled "u" (a happy bowl) with two macro-coloured dots.
export default function LogoMark({ size, scheme }: IProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Image
      source={MARK[scheme ?? colorScheme ?? "light"]}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityLabel="umbii logo"
    />
  );
}
