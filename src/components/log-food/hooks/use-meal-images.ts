import { errorToast } from "@/components/ui/app-toaster";
import {
  IMealImage,
  MAX_MEAL_IMAGES,
} from "@/features/food-logs/generate-food-logs/generate-food-logs.types";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Linking } from "react-native";

// Plenty to read a plate or a bill, and as a JPEG at this quality it stays
// far under the server's 5 MB limit (photos straight off the camera don't).
const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.8;

// The server only takes JPEG/PNG/WEBP; re-encoding also turns HEIC etc.
// into JPEG.
async function prepareImage(
  asset: ImagePicker.ImagePickerAsset,
): Promise<IMealImage> {
  const context = ImageManipulator.manipulate(asset.uri);
  if (Math.max(asset.width, asset.height) > MAX_SIDE) {
    context.resize(
      asset.width >= asset.height ? { width: MAX_SIDE } : { height: MAX_SIDE },
    );
  }
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: JPEG_QUALITY,
  });
  return { uri: result.uri, width: result.width, height: result.height };
}

// Up to 3 photos of one meal attached to the composer: taken with the camera
// or picked from the gallery, each shrunk to an upload-ready JPEG.
export function useMealImages() {
  const [images, setImages] = useState<IMealImage[]>([]);
  // Picked but still being resized: shown as placeholders.
  const [preparingCount, setPreparingCount] = useState(0);
  const isPreparing = preparingCount > 0;
  const remaining = MAX_MEAL_IMAGES - images.length - preparingCount;

  const attach = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) return;
    // The gallery limit is a hint some pickers ignore.
    const assets = result.assets.slice(0, Math.max(remaining, 0));
    if (!assets.length) return;

    setPreparingCount((count) => count + assets.length);
    const prepared = await Promise.allSettled(assets.map(prepareImage));
    setPreparingCount((count) => count - assets.length);

    const ready = prepared.flatMap((outcome) =>
      outcome.status === "fulfilled" ? [outcome.value] : [],
    );
    setImages((current) => [...current, ...ready].slice(0, MAX_MEAL_IMAGES));

    if (ready.length < assets.length) {
      console.error(
        "Error preparing meal image:",
        prepared.find((outcome) => outcome.status === "rejected"),
      );
      errorToast(
        assets.length > 1
          ? "Couldn't use some of those photos"
          : "Couldn't use that photo",
        { id: "meal-image", description: "Try another one." },
      );
    }
  };

  const takePhoto = async () => {
    if (remaining <= 0) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      errorToast("Camera access is off", {
        id: "meal-image",
        description: "Allow it in Settings to snap your meal.",
        action: permission.canAskAgain
          ? undefined
          : { label: "Settings", onPress: () => Linking.openSettings() },
      });
      return;
    }
    await attach(
      await ImagePicker.launchCameraAsync({ mediaTypes: ["images"] }),
    );
  };

  // Android's photo picker needs no permission.
  const pickPhotos = async () => {
    if (remaining <= 0) return;
    await attach(
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: remaining > 1,
        selectionLimit: remaining,
      }),
    );
  };

  return {
    images,
    preparingCount,
    isPreparing,
    isFull: remaining <= 0,
    takePhoto,
    pickPhotos,
    remove: (uri: string) =>
      setImages((current) => current.filter((image) => image.uri !== uri)),
    clear: () => setImages([]),
    // Puts the photos back after a failed send (unless new ones were added).
    restore: (previous: IMealImage[]) =>
      setImages((current) => (current.length ? current : previous)),
  };
}
