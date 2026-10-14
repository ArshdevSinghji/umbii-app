import { View } from "react-native";

// The small grabber bar at the top of a bottom sheet. Marks the sheet's top
// edge (which can be hard to see in dark mode). Absolutely positioned in the
// sheet's top padding, so it doesn't change the layout. Place it as the
// first child of the sheet panel.
export function SheetHandle() {
  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 top-2 items-center"
    >
      <View className="h-1.5 w-10 rounded-full bg-muted-foreground opacity-40" />
    </View>
  );
}
