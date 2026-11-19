import { ApiResponse, http } from "@/lib/http-client";
import { File } from "expo-file-system";
import {
  GenerateFoodLogsRequest,
  GenerateFoodLogsResponse,
} from "./generate-food-logs.types";

// Reading a photo takes several seconds; well past the server's own work.
const GENERATE_TIMEOUT_MS = 60_000;

export const generateFoodLogsService = async (
  request: GenerateFoodLogsRequest,
) => {
  const { userId, rawInputText, images = [] } = request;

  // multipart/form-data: the server answers the old JSON body with 415.
  const form = new FormData();
  if (rawInputText) form.append("rawInputText", rawInputText);
  // One `images` part per file. Expo's fetch (installed globally in SDK 56)
  // can't send React Native's { uri, name, type } parts ("Unsupported
  // FormDataPart implementation"); it reads a file-system File's bytes.
  images.forEach((image, index) => {
    form.append("images", new File(image.uri), `meal-${index + 1}.jpg`);
  });

  return await http.post<ApiResponse<GenerateFoodLogsResponse>>(
    `/users/${userId}/food-logs/generate`,
    form,
    { timeoutMs: GENERATE_TIMEOUT_MS },
  );
};
