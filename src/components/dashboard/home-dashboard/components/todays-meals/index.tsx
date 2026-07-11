import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useListFoodLogsHook } from "@/features/user/list-food-logs/list-food-logs.hook";
import { useAppSelector } from "@/store/hooks";
import BottomSheetLib from "@expo/ui/community/bottom-sheet";
import { Flame } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, View } from "react-native";

const DUMMY_DATA  = {
  message: "Food logs successfully fetched.",
  data: [
    {
      id: 3,
      rawInputText: "I had 4 eggs.",
      createdAt: "2026-07-11T13:35:12.436025",
      details: [
        {
          id: 4,
          name: "Eggs",
          servingQuantity: "4.0",
          servingUnit: "pieces",
          calories: "300.0",
          protein: "24.0",
          carbs: "2.4",
          fats: "20.0",
          fiber: "0.0",
          sugar: "2.4",
          sodium: "260.0",
          createdAt: "2026-07-11T13:35:12.53326",
          updatedAt: "2026-07-11T13:35:12.53326",
        },
      ],
    },
  ],
};

export default function TodaysMeals() {
  const sheetRef = useRef<BottomSheetLib>(null);

  const { user } = useAppSelector((state) => state.userSlice);
  const { listFoodLogs } = useListFoodLogsHook({
    userId: user.id,
    runOnLoad: true,
  });

  return (
    <View className="mt-8">
      <Text className="font-sans-bold text-lg mb-8">Today's meals</Text>

      <Pressable onPress={() => sheetRef.current?.present()}>
        <Card className="gap-3">
          <CardHeader>
            <Text className="font-sans-bold">Breakfast</Text>
          </CardHeader>
          <CardContent className="flex-row justify-between items-center">
            <View className="flex-row gap-1">
              <View className="p-1 bg-muted justify-center rounded-full">
                <Flame size={16} fill={"#FF5A00"} />
              </View>
              <Text>460-465 Kcal</Text>
            </View>
            <View className="flex-row">
              <Avatar
                alt="@mrzachnugent"
                className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2"
              >
                <AvatarImage
                  source={{ uri: "https://github.com/mrzachnugent.png" }}
                />
                <AvatarFallback>
                  <Text>ZN</Text>
                </AvatarFallback>
              </Avatar>
              <Avatar
                alt="@leerob"
                className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2"
              >
                <AvatarImage
                  source={{ uri: "https://github.com/leerob.png" }}
                />
                <AvatarFallback>
                  <Text>LR</Text>
                </AvatarFallback>
              </Avatar>
              <Avatar
                alt="@evilrabbit"
                className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2"
              >
                <AvatarImage
                  source={{ uri: "https://github.com/evilrabbit.png" }}
                />
                <AvatarFallback>
                  <Text>ER</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </CardContent>
        </Card>
      </Pressable>

      <BottomSheet ref={sheetRef} snapPoints={["50%", "90%"]}>
        <Text>Sheet content here</Text>
      </BottomSheet>
    </View>
  );
}
