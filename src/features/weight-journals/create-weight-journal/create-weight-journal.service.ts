import { ApiResponse, http } from "@/lib/http-client";
import { CreateWeightJournalRequest, CreateWeightJournalResponse } from "./create-weight-journal.types";

export const createWeightJournalService = async (request: CreateWeightJournalRequest) => {
  const { userId, ...rest } = request;
  return await http.post<ApiResponse<CreateWeightJournalResponse>>(`/users/${userId}/weight-journals`, { ...rest });
};
