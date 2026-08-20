import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { Camera, Image, Mic, MoveUp, Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, View } from "react-native";
import { useAudioRecorderHook } from "../hooks/use-audio-recorder";
import GenerateMealSheet from "./components/generate-meal-sheet";
import RecordingUI from "./components/recording";
import Loading from "@/components/ui/loading";

export default function FoodInput() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const { generatedFoodLogsDetails } = useAppSelector((state) => state.foodLogsSlice);

  const [log, setLog] = useState("");
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const { generateFoodLogs, createFoodLogs, isLoading } = useFoodLogsActionsHook();
  const { isRecording, startRecording, stopRecording, audioLevelRef } = useAudioRecorderHook();

  const handleSend = async () => {
    const uri = await stopRecording();
    console.log("Recording URI:", uri);
  };

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
      const {rawInputText, details} = generatedFoodLogsDetails;
      await createFoodLogs(user.id, rawInputText, details);
      setIsSheetVisible(false);
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  }

  const handleCancel = async () => {
    await stopRecording();
  };

  if (isRecording) {
    return (
      <RecordingUI
        audioLevelRef={audioLevelRef}
        onCancel={handleCancel}
        onSend={handleSend}
      />
    );
  }

  return (
    <>
      <View className="bg-muted border-border flex-row items-end rounded-3xl border px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <View className="bg-card h-9 w-9 items-center justify-center rounded-full">
              <Plus size={18} color={theme.foreground} />
            </View>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Camera size={18} />
              <Text className="font-sans-bold ml-2">Camera</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Image size={18} />
              <Text className="font-sans-bold ml-2">Photo</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          multiline
          value={log}
          placeholder="What did you eat?"
          onChangeText={setLog}
          className="min-h-10 flex-1 border-0 bg-transparent px-3 py-0 font-sans"
        />

        {log.length === 0 ? (
          <Pressable
            onPress={startRecording}
            className="bg-primary h-9 w-9 items-center justify-center rounded-full"
          >
            <Mic size={18} color={theme.primaryForeground} />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSendText}
            disabled={isLoading}
            className="h-9 w-9 items-center justify-center rounded-full bg-blue-500"
          >
            {isLoading ? (
              <ActivityIndicator color={theme.primaryForeground} />
            ) : (
              <MoveUp size={18} color={theme.primaryForeground} />
            )}
          </Pressable>
        )}
      </View>

      <Modal
        visible={isSheetVisible}
        animationType="slide"
        onRequestClose={() => setIsSheetVisible(false)}
        backdropColor={"rgba(0, 0, 0, 0.2)"}
      >
        <View className="flex-1 justify-end">
          <View className="bg-background rounded-t-3xl p-6 h-[500px]">
            <GenerateMealSheet foodLog={generatedFoodLogsDetails} />
            <View className="flex-row justify-end gap-2 mt-4">
              <Button
                onPress={() => setIsSheetVisible(false)}
                variant={"outline"}
              >
                <Text>Close</Text>
              </Button>
              <Button onPress={handleSaveMeal}>
                <Loading isLoading={isLoading} text="Save Meal" />
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
