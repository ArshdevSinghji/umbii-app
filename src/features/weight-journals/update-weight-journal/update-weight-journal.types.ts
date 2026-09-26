import { IWeightJournal } from "../weight-journals.types";

export interface UpdateWeightJournalRequest {
  userId: number;
  weightJournalId: number;
  currentWeight: string;
  targetWeight: string;
}

export type UpdateWeightJournalResponse = IWeightJournal;
