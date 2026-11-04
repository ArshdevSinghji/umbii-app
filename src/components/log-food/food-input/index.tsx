import { SheetHandle } from "@/components/ui/sheet-handle";
import { eventBus } from "@/lib/event-bus";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { ActionButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { FLOATING_INPUT_BAR_BOTTOM_OFFSET } from "@/lib/floating-tab-bar";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUp } from "phosphor-react-native/src/icons/ArrowUp";
import { Microphone } from "phosphor-react-native/src/icons/Microphone";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { errorToast } from "@/components/ui/app-toaster";
import { useFocusEffect } from "expo-router";
import { useMealGeneration } from "../hooks/use-meal-generation";
import GenerationStatus from "./generation-status";
import { useVoiceInput } from "../hooks/use-voice-input";
import PendingMeal from "./pending-meal";
import GenerateMealSheet from "./generate-meal-sheet";
import RecordingBar from "./recording";

// Two states, like ChatGPT's composer: a one-row pill (text, mic, send)
// while the text fits on one line, and a box (text on top, actions under it)
// once it needs more. The field grows a line at a time (20px lines + 8px
// padding) up to six lines, then scrolls inside itself.
const LINE_HEIGHT = 20;
const INPUT_PADDING_X = 12;
const INPUT_PADDING_Y = 8;
const MIN_INPUT_HEIGHT = LINE_HEIGHT + INPUT_PADDING_Y * 2;
const MAX_INPUT_HEIGHT = LINE_HEIGHT * 6 + INPUT_PADDING_Y * 2;
const COMPOSER_PADDING = 8;
// The switch to the box happens this much before the text would really
// wrap in the pill (about a character). The measurement lands a frame after
// the text changes; switching early means that frame still shows a
// one-line pill instead of a two-line pill, so it's one step, not two.
const SWITCH_EARLY_BY = 14;
// Between the text and the actions row in the box.
const BOX_ROW_GAP = 4;
const BUTTON_SIZE = 36;
const GAP = 8;
// Mic + send.
const ACTIONS_WIDTH = BUTTON_SIZE * 2 + GAP;
// More than half the pill's height, so one row is a full pill; the box has
// softer corners. Like ChatGPT, it snaps between the two (and grows a line
// at a time) without animating.
const PILL_RADIUS = 28;
const BOX_RADIUS = 22;

interface IProps {
  // The composer's height, so the list behind it can make room as it grows.
  onHeightChange?: (height: number) => void;
}

export default function FoodInput({ onHeightChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const { generatedFoodLogsDetails } = useAppSelector(
    (state) => state.foodLogsSlice,
  );

  const [log, setLog] = useState("");
  const inputRef = useRef<TextInput>(null);
  const hasText = log.trim().length > 0;
  const [composerWidth, setComposerWidth] = useState(0);
  // Whether the text needs more than one line at the pill's width. Measured
  // on a hidden copy of the text that always has that width, so the box
  // folds back into a pill once the text fits again.
  const [needsMoreLines, setNeedsMoreLines] = useState(false);
  const pillTextWidth =
    composerWidth -
    COMPOSER_PADDING * 2 -
    ACTIONS_WIDTH -
    GAP -
    INPUT_PADDING_X * 2 -
    SWITCH_EARLY_BY;

  // Other parts of the page (e.g. recipes' "Add a recipe") can ask for focus.
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    eventBus.on("food-input:focus", focus);
    return () => {
      eventBus.off("food-input:focus", focus);
    };
  }, []);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const { createFoodLogs, isLoading } = useFoodLogsActionsHook();

  const { pending, isGenerating, generate } = useMealGeneration();
  const voice = useVoiceInput();
  const isRecording = voice.status !== "idle";

  // Log Food stays mounted behind other tabs: drop a recording on leaving it.
  useFocusEffect(
    useCallback(() => {
      return () => voice.cancel();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // Clears only once the meal is generated; on failure the text stays to
  // retry or edit.
  // Like a chat: the message floats up above the composer and the field
  // shows its progress, so a slow reply never looks stuck. On failure the
  // text comes back to retry or edit.
  const submit = async (text: string) => {
    const message = text.trim();
    if (!message || isGenerating) return;
    setLog("");

    try {
      if (await generate(user.id, message)) setIsSheetVisible(true);
    } catch (error) {
      console.error("Error generating food logs:", error);
      setLog((current) => current || message);
      errorToast("Couldn't work out that meal", {
        id: "generate-meal",
        description: "Check your connection and try again.",
      });
    }
  };

  const handleSendText = () => submit(log);

  const startRecording = () => {
    inputRef.current?.blur();
    voice.start();
  };

  // Words go after anything already typed.
  const finishRecording = async () => {
    const text = await voice.finish();
    if (!text) {
      errorToast("Didn't catch that", {
        id: "voice-input",
        description: "Try again a little closer to the mic.",
      });
      return null;
    }
    const combined = [log.trim(), text].filter(Boolean).join(" ");
    setLog(combined);
    return combined;
  };

  const handleStopRecording = async () => {
    if (await finishRecording()) inputRef.current?.focus();
  };

  const handleSendRecording = async () => {
    const text = await finishRecording();
    if (text) await submit(text);
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

  // Recording always shows the pill with just the recording bar; typed text
  // is kept (hidden) and the words are appended to it when recording ends.
  const isExpanded = needsMoreLines && !isRecording;

  const radius = isExpanded ? BOX_RADIUS : PILL_RADIUS;

  return (
    <>
      {/* Dims the page while a meal is worked out, so the message and its
          status stand out and it's clear the request is being handled. It
          also holds taps on the list until the result is in. */}
      {pending && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                colorScheme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)",
            },
          ]}
        />
      )}
      <Animated.View
        onLayout={(event: LayoutChangeEvent) =>
          onHeightChange?.(event.nativeEvent.layout.height)
        }
        style={[
          {
            position: "absolute",
            start: 24,
            end: 24,
          },
          animatedPositionStyle,
        ]}
      >
        {/* Rides just above the composer, keyboard included. */}
        {pending && (
          <Animated.View
            exiting={FadeOut.duration(150)}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "100%",
              paddingBottom: 12,
            }}
          >
            <PendingMeal meal={pending} />
          </Animated.View>
        )}
        <LinearGradient
          colors={borderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius, padding: 1 }}
        >
          <LinearGradient
            colors={[theme.card, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radius - 1 }}
          >
            {/* One wrapping row, so the input is never remounted (that would
            close the keyboard): in the box the input takes the whole width
            and the actions wrap under it. */}
            <View
              onLayout={(event) =>
                setComposerWidth(event.nativeEvent.layout.width)
              }
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                padding: COMPOSER_PADDING,
                columnGap: GAP,
                rowGap: BOX_ROW_GAP,
              }}
            >
              {pillTextWidth > 0 && (
                <Text
                  aria-hidden
                  importantForAccessibility="no-hide-descendants"
                  pointerEvents="none"
                  onLayout={(event) =>
                    setNeedsMoreLines(
                      event.nativeEvent.layout.height > LINE_HEIGHT + 1,
                    )
                  }
                  className="font-sans text-base"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: pillTextWidth,
                    lineHeight: LINE_HEIGHT,
                  }}
                >
                  {log || " "}
                </Text>
              )}

              {/* Over the (empty, read-only) field, lined up with where its
                  text starts. */}
              {pending && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: COMPOSER_PADDING,
                    top: COMPOSER_PADDING,
                    height: MIN_INPUT_HEIGHT,
                    justifyContent: "center",
                  }}
                >
                  <GenerationStatus stage={pending.stage} />
                </View>
              )}

              <Input
                ref={inputRef}
                multiline
                value={log}
                // While a meal is worked out, a status chip takes the
                // placeholder's place (below) rather than a blank field.
                placeholder={pending ? "" : "What did you eat?"}
                onChangeText={setLog}
                // Read-only while recording (and hidden, below), so the words
                // land after exactly what was there; and while generating, so
                // the progress stays visible.
                editable={!isRecording && !isGenerating}
                // Enter sends (no newline); pasted line breaks stay. Android's
                // keyboard can't report Shift, so there's no Shift+Enter: long
                // text wraps on its own.
                submitBehavior="submit"
                returnKeyType="send"
                onSubmitEditing={handleSendText}
                // Centred in the pill: Android draws the placeholder without
                // the line height typed text gets, so top-aligned it sits
                // high. The box stacks lines from the top.
                textAlignVertical={isExpanded ? "top" : "center"}
                style={{
                  // Pill: shares the row with the actions. Box: a fixed full
                  // width that can't shrink, which is what makes the actions
                  // wrap under it (a 100% flex-basis alone doesn't).
                  ...(isExpanded
                    ? { width: "100%", flexGrow: 0, flexShrink: 0 }
                    : { flexGrow: 1, flexShrink: 1, flexBasis: 0 }),
                  // Grows with the text between these, then scrolls inside;
                  // shrinks back as text is deleted or sent.
                  minHeight: MIN_INPUT_HEIGHT,
                  // The pill never grows: e.g. a long paste goes straight to the
                  // box rather than flashing a tall pill first.
                  maxHeight: isExpanded ? MAX_INPUT_HEIGHT : MIN_INPUT_HEIGHT,
                  paddingHorizontal: INPUT_PADDING_X,
                  paddingVertical: INPUT_PADDING_Y,
                  lineHeight: LINE_HEIGHT,
                  // Recording: the bar takes the whole pill. Taken out of the
                  // layout and made invisible rather than `display: none`,
                  // which the input's own `flex` class overrides; it stays
                  // mounted so it can take focus again after recording.
                  ...(isRecording && {
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    minHeight: 0,
                  }),
                }}
                pointerEvents={isRecording ? "none" : "auto"}
                onFocus={() => {
                  isFocused.value = true;
                }}
                onBlur={() => {
                  isFocused.value = false;
                }}
                // `opacity-100`: the input dims itself when not editable.
                className="h-auto w-auto min-w-0 sm:h-auto border-0 bg-transparent dark:bg-transparent font-sans opacity-100"
              />

              <View
                className="flex-row items-center"
                style={{
                  columnGap: GAP,
                  // In the box the actions sit at the right of their own row;
                  // the recording bar takes all of it.
                  marginLeft: "auto",
                  ...(isRecording && { flexBasis: "100%", flexGrow: 1 }),
                }}
              >
                {isRecording ? (
                  <RecordingBar
                    level={voice.level}
                    isFinishing={voice.status === "finishing"}
                    onCancel={voice.cancel}
                    onStop={handleStopRecording}
                    onSend={handleSendRecording}
                  />
                ) : (
                  <>
                    <Pressable
                      onPress={startRecording}
                      disabled={isGenerating}
                      hitSlop={6}
                      accessibilityLabel="Log by voice"
                      className="items-center justify-center rounded-full"
                      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
                    >
                      <Microphone size={22} color={theme.foreground} />
                    </Pressable>

                    {/* Always there; only real text enables it (spaces alone
                        can't be sent). */}
                    <Pressable
                      onPress={handleSendText}
                      // No spinner here: progress shows under the sent
                      // message instead.
                      disabled={!hasText || isGenerating}
                      accessibilityLabel="Log this meal"
                      className={cn(
                        "items-center justify-center rounded-full",
                        hasText ? "bg-blue-500" : "bg-muted",
                      )}
                      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
                    >
                      <ArrowUp
                        size={18}
                        weight="bold"
                        color={hasText ? "white" : theme.mutedForeground}
                      />
                    </Pressable>
                  </>
                )}
              </View>
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
