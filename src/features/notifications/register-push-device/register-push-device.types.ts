import { PushPlatform } from "../notifications.types";

export interface RegisterPushDeviceRequest {
  userId: number;
  expoPushToken: string;
  platform: PushPlatform;
  // IANA zone. Redundant with the X-Timezone header (sent on every
  // request); kept since the endpoint still accepts it.
  timezone?: string;
}
