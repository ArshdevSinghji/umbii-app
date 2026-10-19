import { ApiResponse, http } from "@/lib/http-client";
import { GetUserRequest, GetUserResponse } from "./get-user.types";

export const getUserService = async (request: GetUserRequest) => {
  const { userId } = request;
  return await http.get<ApiResponse<GetUserResponse>>(`/users/${userId}`);
};
