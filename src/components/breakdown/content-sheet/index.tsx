import { THEME } from "@/lib/theme";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { ReactNode, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

function SheetGrabber() {
  return (
    <View className="h-6 items-center justify-center">
      <View className="h-1.5 w-10 rounded-full bg-muted-foreground opacity-40" />
    </View>
  );
}

// How much of the screen area the sheet covers when pulled all the way up.
// Fixed, so the calendar under it never has to re-lay out.
const EXPANDED_SHEET_RATIO = 0.75;

interface IProps {
  // Where the sheet's top edge rests, measured from the top of the screen
  // area: just under the month grid.
  restingTop: number;
  children: ReactNode;
}

// Map-app style sheet over the calendar: a drag anywhere on it moves the
// sheet, and its content only scrolls once it's fully up. Pulling down while
// scrolled to the top brings it back down. The library hands the gesture
// between the sheet and the scroll view, which a plain ScrollView can't.
export default function ContentSheet({ restingTop, children }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const [containerHeight, setContainerHeight] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) =>
    setContainerHeight(event.nativeEvent.layout.height);

  // Snap points are heights from the bottom, lowest first. The top one never
  // goes below the resting one (a very short screen).
  const restingHeight = containerHeight - restingTop;
  const snapPoints = [
    restingHeight,
    Math.max(containerHeight * EXPANDED_SHEET_RATIO, restingHeight),
  ];

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
      onLayout={handleLayout}
    >
      {containerHeight > 0 && (
        <BottomSheet
          index={0}
          snapPoints={snapPoints}
          // Sizes come from the calendar, not from the content.
          enableDynamicSizing={false}
          // It's part of the page, so it's simply there on first render.
          animateOnMount={false}
          handleComponent={SheetGrabber}
          backgroundStyle={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <BottomSheetScrollView
            // One section on the page, not separate cards: calories, then
            // the health score and nutrients.
            contentContainerStyle={{
              gap: 12,
              paddingTop: 8,
              paddingHorizontal: 16,
              paddingBottom: FLOATING_TAB_BAR_CLEARANCE,
            }}
          >
            {children}
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </View>
  );
}
