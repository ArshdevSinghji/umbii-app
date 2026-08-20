import { ApiResponse, http } from "@/lib/http-client";
import { ListFoodLogsRequest } from "./list-food-logs.types";
import { IFoodLog } from "../user.types";

export const listFoodLogsService = async (request: ListFoodLogsRequest) => {
  const { userId, params } = request;
  return await http.get<ApiResponse<IFoodLog[]>>(`/users/${userId}/food-logs`, { params });
};
