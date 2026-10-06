import { ApiResponse, http } from "@/lib/http-client";
import { IWeightJournal } from "../weight-journals.types";
import { ListWeightJournalsRequest } from "./list-weight-journals.types";

export const listWeightJournalsService = async (request: ListWeightJournalsRequest) => {
  const { userId, params } = request;
  return await http.get<ApiResponse<IWeightJournal[]>>(`/users/${userId}/weight-journals`, { params });
};
