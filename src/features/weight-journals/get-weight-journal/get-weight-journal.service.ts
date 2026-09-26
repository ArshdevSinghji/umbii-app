import { ApiResponse, http } from "@/lib/http-client";
import { GetWeightJournalRequest, GetWeightJournalResponse } from "./get-weight-journal.types";

export const getWeightJournalService = async (request: GetWeightJournalRequest) => {
  const { userId, weightJournalId } = request;
  return await http.get<ApiResponse<GetWeightJournalResponse>>(`/users/${userId}/weight-journals/${weightJournalId}`);
};
