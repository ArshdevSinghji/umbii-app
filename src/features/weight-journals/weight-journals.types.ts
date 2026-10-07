export enum WeightJournalActionTypes {
  LIST_WEIGHT_JOURNALS = "weight-journals/list-weight-journals",
  CREATE_WEIGHT_JOURNAL = "weight-journals/create-weight-journal",
  GET_WEIGHT_JOURNAL = "weight-journals/get-weight-journal",
  UPDATE_WEIGHT_JOURNAL = "weight-journals/update-weight-journal",
  DELETE_WEIGHT_JOURNAL = "weight-journals/delete-weight-journal",
}

export interface IWeightJournal {
  id: number;
  currentWeight: string;
  targetWeight: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightJournalState {
  // List fetch only — drives the initial skeleton.
  isLoading: boolean;
  // Create / update / delete — drives sheet buttons, never the skeleton.
  isSaving: boolean;
  listWeightJournals: IWeightJournal[];
  selectedWeightJournal: IWeightJournal | null;
}
