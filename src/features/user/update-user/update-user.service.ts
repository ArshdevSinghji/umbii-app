import { ApiResponse, http } from "@/lib/http-client";
import { UpdateUserRequest, UpdateUserResponse } from "./update-user.types";

export const updateUserService = async (request: UpdateUserRequest) => {
  const { userId, ...rest } = request;
  return await http.put<ApiResponse<UpdateUserResponse>>(`/users/${userId}`, { ...rest });
};
