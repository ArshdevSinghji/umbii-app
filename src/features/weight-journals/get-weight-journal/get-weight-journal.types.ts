import { IWeightJournal } from "../weight-journals.types";

export interface GetWeightJournalRequest {
  userId: number;
  weightJournalId: number;
}

export type GetWeightJournalResponse = IWeightJournal;
