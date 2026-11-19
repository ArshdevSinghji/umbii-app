import { IFoodLogDetail } from "../food-logs.types";

// A meal photo or food bill, already resized and re-encoded as JPEG on the
// device (the server takes JPEG/PNG/WEBP up to 5 MB).
export interface IMealImage {
  uri: string;
  width: number;
  height: number;
}

// Photos of one meal (or its bills) per request; a food seen in several is
// counted once.
export const MAX_MEAL_IMAGES = 3;

// Text, images, or both (at least one). With both, the text says what was
// actually eaten (e.g. "I had half") and wins over the images.
export interface GenerateFoodLogsRequest {
  userId: number;
  rawInputText?: string;
  images?: IMealImage[];
}

// For an images-only request, `rawInputText` is the model's summary of the
// image (save it with the log). Empty `details` = no food recognised.
export interface GenerateFoodLogsResponse {
  remark: string;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
}
