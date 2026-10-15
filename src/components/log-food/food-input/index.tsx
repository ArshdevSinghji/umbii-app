import { SheetHandle } from "@/components/ui/sheet-handle";
import { eventBus } from "@/lib/event-bus";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { FLOATING_INPUT_BAR_BOTTOM_OFFSET } from "@/lib/floating-tab-bar";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUp } from "phosphor-react-native/src/icons/ArrowUp";
import { Microphone } from "phosphor-react-native/src/icons/Microphone";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import GenerateMealSheet from "./generate-meal-sheet";

export default function FoodInput() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const { generatedFoodLogsDetails } = useAppSelector(
    (state) => state.foodLogsSlice,
  );

  const [log, setLog] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Other parts of the page (e.g. recipes' "Add a recipe") can ask for focus.
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    eventBus.on("food-input:focus", focus);
    return () => {
      eventBus.off("food-input:focus", focus);
    };
  }, []);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const { generateFoodLogs, createFoodLogs, isLoading } =
    useFoodLogsActionsHook();

  const handleSendText = async () => {
    if (!log.trim()) return;

    try {
      await generateFoodLogs(user.id, log);
      setIsSheetVisible(true);
      setLog("");
    } catch (error) {
      console.error("Error generating food logs:", error);
    }
  };

  const handleSaveMeal = async () => {
    try {
      const { rawInputText, details } = generatedFoodLogsDetails;
      await createFoodLogs(user.id, rawInputText, details);
      setIsSheetVisible(false);
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  const borderGradient: [string, string] =
    colorScheme === "dark"
      ? ["rgba(255,255,255,0.18)", "rgba(255,255,255,0.02)"]
      : ["rgba(0,0,0,0.14)", "rgba(0,0,0,0.02)"];

  // From react-native-keyboard-controller: `height` is the offset to move
  // content by, so it's negative while the keyboard is open.
  const keyboard = useReanimatedKeyboardAnimation();
  // Only ride the keyboard when this input has it. When another field opens
  // the keyboard (e.g. recipe search), stay put; the keyboard covers it.
  const isFocused = useSharedValue(false);
  const animatedPositionStyle = useAnimatedStyle(() => {
    const keyboardHeight = -keyboard.height.value;
    const isKeyboardOpen = keyboardHeight > 0;
    return {
      bottom:
        isKeyboardOpen && isFocused.value
          ? keyboardHeight + 12
          : FLOATING_INPUT_BAR_BOTTOM_OFFSET,
    };
  });

  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            start: 24,
            end: 24,
          },
          animatedPositionStyle,
        ]}
      >
        <LinearGradient
          colors={borderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 999,
            padding: 1,
          }}
        >
          <LinearGradient
            colors={[theme.card, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 999 }}
          >
            <View className="flex-row items-end px-3 py-2">
              <Input
                ref={inputRef}
                multiline
                value={log}
                placeholder="What did you eat?"
                onChangeText={setLog}
                onFocus={() => {
                  isFocused.value = true;
                }}
                onBlur={() => {
                  isFocused.value = false;
                }}
                className="min-h-10 flex-1 border-0 bg-transparent dark:bg-transparent px-2 py-0 font-sans"
              />

              {log.length === 0 ? (
                <View className="h-9 w-9 items-center justify-center">
                  <Microphone size={20} color={theme.mutedForeground} />
                </View>
              ) : (
                <Pressable
                  onPress={handleSendText}
                  disabled={isLoading}
                  className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.primaryForeground} />
                  ) : (
                    <ArrowUp size={18} color={theme.primaryForeground} />
                  )}
                </Pressable>
              )}
            </View>
          </LinearGradient>
        </LinearGradient>
      </Animated.View>

      <Modal
        visible={isSheetVisible}
        animationType="slide"
        // Can't be dismissed while the meal is being saved.
        onRequestClose={() => !isLoading && setIsSheetVisible(false)}
        backdropColor={"rgba(0, 0, 0, 0.2)"}
      >
        <View className="flex-1 justify-end">
          <View className="bg-background rounded-t-3xl p-6 h-[500px]">
            <SheetHandle />
            <GenerateMealSheet foodLog={generatedFoodLogsDetails} />
            <View className="flex-row gap-2 mt-4">
              <ActionButton
                className="flex-1"
                variant="outline"
                label="Close"
                onPress={() => setIsSheetVisible(false)}
                disabled={isLoading}
              />
              <ActionButton
                className="flex-1"
                label="Save Meal"
                onPress={handleSaveMeal}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
