export interface ListWeightJournalsRequest {
  userId: number;
  params?: {
    "dateRange.startDate"?: string;
    "dateRange.endDate"?: string;
  };
}
