import { ApiResponse, http } from "@/lib/http-client";
import { DeleteWeightJournalRequest, DeleteWeightJournalResponse } from "./delete-weight-journal.types";

export const deleteWeightJournalService = async (request: DeleteWeightJournalRequest) => {
  const { userId, weightJournalId } = request;
  return await http.delete<ApiResponse<DeleteWeightJournalResponse>>(
    `/users/${userId}/weight-journals/${weightJournalId}`,
  );
};
