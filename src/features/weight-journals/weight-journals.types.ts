export enum WeightJournalActionTypes {
  LIST_WEIGHT_JOURNALS = "weight-journals/list-weight-journals",
  CREATE_WEIGHT_JOURNAL = "weight-journals/create-weight-journal",
  GET_WEIGHT_JOURNAL = "weight-journals/get-weight-journal",
  UPDATE_WEIGHT_JOURNAL = "weight-journals/update-weight-journal",
  DELETE_WEIGHT_JOURNAL = "weight-journals/delete-weight-journal",
  GET_LATEST_WEIGHT_JOURNAL = "weight-journals/get-latest-weight-journal",
}

// One weigh-in (one per user per day). The goal weight lives on the
// profile, not here.
export interface IWeightJournal {
  id: number;
  // Kilograms.
  weightKg: number;
  createdAt: string;
  updatedAt: string;
}

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface WeightJournalState {
  // All-time latest entry (list endpoint, no date range). The user's current
  // state: cards, BMI, onboarding, and "update today's entry vs create".
  latestWeightJournal: IWeightJournal | null;
  latestStatus: LoadStatus;
  // Entries in the chart's date range (list endpoint with dateRange).
  chartWeightJournals: IWeightJournal[];
  chartRange: { startDate: string; endDate: string } | null;
  chartStatus: LoadStatus;
  // Create / update / delete — drives save buttons, never a skeleton.
  isSaving: boolean;
  selectedWeightJournal: IWeightJournal | null;
  isSelectedLoading: boolean;
}
