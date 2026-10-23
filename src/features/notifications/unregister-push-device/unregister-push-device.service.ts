import { ApiResponse, http } from "@/lib/http-client";
import { UnregisterPushDeviceRequest } from "./unregister-push-device.types";

// For turning push off in the app. Sign-out doesn't need it: ending the
// session removes the device on the server.
export const unregisterPushDeviceService = async (
  request: UnregisterPushDeviceRequest,
) => {
  const { userId, pushDeviceId } = request;
  return await http.delete<ApiResponse<null>>(
    `/users/${userId}/push-devices/${pushDeviceId}`,
  );
};
