import { ApiResponse, http } from "@/lib/http-client";
import { UpdateWeightJournalRequest, UpdateWeightJournalResponse } from "./update-weight-journal.types";

export const updateWeightJournalService = async (request: UpdateWeightJournalRequest) => {
  const { userId, weightJournalId, ...rest } = request;
  return await http.put<ApiResponse<UpdateWeightJournalResponse>>(
    `/users/${userId}/weight-journals/${weightJournalId}`,
    { ...rest },
  );
};
