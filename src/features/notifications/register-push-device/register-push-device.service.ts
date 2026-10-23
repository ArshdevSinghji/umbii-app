import { ApiResponse, http } from "@/lib/http-client";
import { IPushDevice } from "../notifications.types";
import { RegisterPushDeviceRequest } from "./register-push-device.types";

// Upsert, so it's safe on every launch and sign-in.
export const registerPushDeviceService = async (
  request: RegisterPushDeviceRequest,
) => {
  const { userId, ...body } = request;
  return await http.post<ApiResponse<IPushDevice>>(
    `/users/${userId}/push-devices`,
    body,
  );
};
