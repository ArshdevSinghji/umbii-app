import { IWeightJournal } from "../weight-journals.types";

export interface CreateWeightJournalRequest {
  userId: number;
  currentWeight: string;
  targetWeight: string;
}

export type CreateWeightJournalResponse = IWeightJournal;
