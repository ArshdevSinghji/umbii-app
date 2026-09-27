import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import {
  Activity,
  Beef,
  Candy,
  Droplets,
  Flame,
  Salad,
  Wheat,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

interface IProps {
  log: IFoodLog;
}

export default function MealSheetContent({ log }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const totalCalories = calculateNutrition(log.details).calories;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-2">
        <View className="flex-row justify-between items-center gap-2">
          <Text className="text-muted-foreground text-sm flex-1" numberOfLines={2}>
            {log.rawInputText}
          </Text>
          <View className="flex-row gap-1 items-center">
            <Flame size={14} fill="#FF5A00" color="#FF5A00" />
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
                <Text className="text-sm">{parseFloat(detail.calories).toFixed(0)} Kcal</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Beef size={14} color={theme.foreground} />
                  <Text>Protein</Text>
                </View>
                <Text className="font-sans-bold">{detail.protein} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Salad size={14} color={theme.foreground} />
                  <Text>Fiber</Text>
                </View>
                <Text className="font-sans-bold">{detail.fiber} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Wheat size={14} color={theme.foreground} />
                  <Text>Carbs</Text>
                </View>
                <Text className="font-sans-bold">{detail.carbs} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Droplets size={14} color={theme.foreground} />
                  <Text>Fats</Text>
                </View>
                <Text className="font-sans-bold">{detail.fats} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Activity size={14} color={theme.foreground} />
                  <Text>Sodium</Text>
                </View>
                <Text className="font-sans-bold">{detail.sodium} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Candy size={14} color={theme.foreground} />
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
