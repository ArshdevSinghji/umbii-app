import { IWeightJournal } from "../weight-journals.types";

export interface CreateWeightJournalRequest {
  userId: number;
  // Kilograms. POST is an upsert for today: a later save the same day
  // replaces the entry (same id).
  weightKg: number;
}

export type CreateWeightJournalResponse = IWeightJournal;
