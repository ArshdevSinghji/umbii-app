import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

// Lighter top-left to darker bottom-right, around the card colour, with a
// hairline outline. Hex, since the gradient needs plain colour strings.
// Shared with the floating tab bar so the headline surfaces match.
export const CARD_GRADIENT = {
  light: {
    colors: ["#FFFFFF", "#F7F7F8", "#ECECEF"] as const,
    border: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    colors: ["#303034", "#222225", "#161618"] as const,
    border: "rgba(255, 255, 255, 0.08)",
  },
};

// A Card with a soft diagonal gradient, for the headline cards only (e.g.
// Home's Today's Goal); everything else stays a plain Card.
export function GradientCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  const { colorScheme } = useColorScheme();
  const gradient = CARD_GRADIENT[colorScheme ?? "light"];

  return (
    <Card
      className={cn("border bg-transparent", className)}
      style={{ borderColor: gradient.border }}
      {...props}
    >
      {/* Rounded itself rather than clipping the card: overflow "hidden"
          would also clip the card's shadow on iOS. 23 = the card's 24px
          radius inside its 1px border. Absolute, so it takes no gap. */}
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
          borderRadius: 23,
        }}
      />
      {children}
    </Card>
  );
}
