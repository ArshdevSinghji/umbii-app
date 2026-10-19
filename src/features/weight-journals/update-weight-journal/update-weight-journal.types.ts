import { IWeightJournal } from "../weight-journals.types";

export interface UpdateWeightJournalRequest {
  userId: number;
  weightJournalId: number;
  // Kilograms.
  weightKg: number;
}

export type UpdateWeightJournalResponse = IWeightJournal;
