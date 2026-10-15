import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { GenerateFoodLogsDetails } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { Cookie } from "phosphor-react-native/src/icons/Cookie";
import { Avocado } from "phosphor-react-native/src/icons/Avocado";
import { Egg } from "phosphor-react-native/src/icons/Egg";
import { Grains } from "phosphor-react-native/src/icons/Grains";
import { Leaf } from "phosphor-react-native/src/icons/Leaf";
import { Pulse } from "phosphor-react-native/src/icons/Pulse";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, View } from "react-native";

interface IProps {
  foodLog: GenerateFoodLogsDetails;
}

export default function GenerateMealSheet({ foodLog }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <ScrollView>
      <View className="gap-2">
        <Text className="text-muted-foreground text-sm">
          {foodLog.rawInputText}
        </Text>

        <Separator className="bg-accent-foreground/30" />

        <View>
          <Text className="font-sans-bold">Remarks:</Text>
          <Text className="text-sm">{foodLog.remark}</Text>
        </View>

        <Separator className="bg-accent-foreground/30" />

        {foodLog.details.map((log, index) => (
          <React.Fragment key={index}>
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-sans-bold">{log.name}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {log.servingQuantity} g
                  </Text>
                </View>
                <Text className="text-sm">
                  {Number(log.calories).toFixed(0)} Kcal
                </Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Egg size={14} color={theme.foreground} />
                  <Text>Protein</Text>
                </View>
                <Text className="font-sans-bold">{log.protein} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Leaf size={14} color={theme.foreground} />
                  <Text>Fiber</Text>
                </View>
                <Text className="font-sans-bold">{log.fiber} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Grains size={14} color={theme.foreground} />
                  <Text>Carbs</Text>
                </View>
                <Text className="font-sans-bold">{log.carbs} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Avocado size={14} color={theme.foreground} />
                  <Text>Fats</Text>
                </View>
                <Text className="font-sans-bold">{log.fats} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Pulse size={14} color={theme.foreground} />
                  <Text>Sodium</Text>
                </View>
                <Text className="font-sans-bold">{log.sodium} g</Text>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row gap-1 items-center">
                  <Cookie size={14} color={theme.foreground} />
                  <Text>Sugar</Text>
                </View>
                <Text className="font-sans-bold">{log.sugar} g</Text>
              </View>
            </View>
            {index !== foodLog.details.length - 1 && (
              <Separator className="bg-accent-foreground/30" />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}
