import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import { Cookie } from "phosphor-react-native/src/icons/Cookie";
import { Avocado } from "phosphor-react-native/src/icons/Avocado";
import { Egg } from "phosphor-react-native/src/icons/Egg";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { Grains } from "phosphor-react-native/src/icons/Grains";
import { Leaf } from "phosphor-react-native/src/icons/Leaf";
import { Pulse } from "phosphor-react-native/src/icons/Pulse";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

interface IProps {
  // A food log, or anything shaped like one (e.g. a recipe: its name and
  // the meal's items).
  log: Pick<IFoodLog, "rawInputText" | "details">;
}

export default function MealSheetContent({ log }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const totalCalories = calculateNutrition(log.details).calories;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-2">
        <View className="flex-row justify-between items-center gap-2">
          <Text
            className="text-muted-foreground text-sm flex-1"
            numberOfLines={2}
          >
            {log.rawInputText}
          </Text>
          <View className="flex-row gap-1 items-center">
            <Fire size={14} weight="fill" color="#FF5A00" />
            <Text className="font-sans-bold text-sm">
              {totalCalories.toFixed(0)} Kcal
            </Text>
          </View>
        </View>

        <Separator className="bg-accent-foreground/30" />

        {log.details.map((detail, index) => (
          <React.Fragment key={detail.id}>
            <View className="pb-2">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-sans-bold">{detail.name}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {detail.servingQuantity} {detail.servingUnit}
                  </Text>
                </View>
                <Text className="text-sm">
                  {Number(detail.calories).toFixed(0)} Kcal
                </Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Egg size={14} color={theme.foreground} />
                  <Text>Protein</Text>
                </View>
                <Text className="font-sans-bold">{detail.protein} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Leaf size={14} color={theme.foreground} />
                  <Text>Fiber</Text>
                </View>
                <Text className="font-sans-bold">{detail.fiber} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Grains size={14} color={theme.foreground} />
                  <Text>Carbs</Text>
                </View>
                <Text className="font-sans-bold">{detail.carbs} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Avocado size={14} color={theme.foreground} />
                  <Text>Fats</Text>
                </View>
                <Text className="font-sans-bold">{detail.fats} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Pulse size={14} color={theme.foreground} />
                  <Text>Sodium</Text>
                </View>
                <Text className="font-sans-bold">{detail.sodium} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Cookie size={14} color={theme.foreground} />
                  <Text>Sugar</Text>
                </View>
                <Text className="font-sans-bold">{detail.sugar} g</Text>
              </View>
            </View>
            {index < log.details.length - 1 && (
              <Separator className="bg-accent-foreground/30" />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}
