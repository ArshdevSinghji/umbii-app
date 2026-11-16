import { PushPlatform } from "../notifications.types";

export interface RegisterPushDeviceRequest {
  userId: number;
  expoPushToken: string;
  platform: PushPlatform;
}
