import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import BottomSheetLib from "@expo/ui/community/bottom-sheet";
import { Flame } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import TodaysMealsSkeleton from "./loading";
import MealSheetContent from "./meal-sheet-content";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { CategorizedSection, categorizeFoodLogs } from "@/features/food-logs/food-logs.utils";

export default function TodaysMeals() {
  const { isLoading, listFoodLogs } = useFoodLogsActionsHook();
  const sheetRef = useRef<BottomSheetLib>(null);

  const [selectedSection, setSelectedSection] = useState<CategorizedSection | null>(null);
  const sections = categorizeFoodLogs(listFoodLogs ?? []).filter(
    (section) => section.logs.length > 0,
  );

  const handleSectionPress = (section: CategorizedSection) => {
    setSelectedSection(section);
    sheetRef.current?.present();
  };

  return (
    <View className="mt-8">
      <Text className="font-sans-bold text-lg mb-8">Today's meals</Text>

      {isLoading ? (
        <TodaysMealsSkeleton />
      ) : sections.length === 0 ? (
        <Card className="py-6">
          <CardContent className="items-center">
            <Text className="font-sans-bold text-base">
              No meals logged
            </Text>
            <Text className="text-muted-foreground text-center text-sm">
              Start tracking your meals to see calories and nutrition
              breakdowns.
            </Text>
          </CardContent>
        </Card>
      ) : (
        <View className="gap-3">
          {sections.map((section) => (
            <Pressable
              key={section.label}
              onPress={() => handleSectionPress(section)}
            >
              <Card className="gap-2 py-4">
                <CardHeader className="px-4">
                  <Text className="font-sans-bold">{section.label}</Text>
                </CardHeader>
                <CardContent className="flex-row justify-between items-center px-4">
                  <View className="flex-row gap-2">
                    <View
                      style={{ backgroundColor: "#FFF4ED" }}
                      className="p-1 rounded-full"
                    >
                      <Flame size={16} color="#FF5A00" fill="#FF5A00" />
                    </View>
                    <Text className="font-sans-bold">
                      {`${section.totalCalories.toFixed(0)} Kcal`}
                    </Text>
                  </View>
                  <Text className="text-muted-foreground text-xs">
                    {section.logs.length}{" "}
                    {section.logs.length === 1 ? "entry" : "entries"}
                  </Text>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <BottomSheet ref={sheetRef} snapPoints={["50%", "90%"]}>
        <MealSheetContent key={selectedSection?.label} section={selectedSection!} />
      </BottomSheet>
    </View>
  );
}
