import { ApiResponse, http } from "@/lib/http-client";
import { DeleteUserRequest } from "./delete-user.types";

// Deletes the account and everything that belongs to it. Can't be undone.
export const deleteUserService = async (request: DeleteUserRequest) => {
  const { userId } = request;
  return await http.delete<ApiResponse<null>>(`/users/${userId}`);
};
