export interface ListFoodLogsRequest {
  userId: number;
  params?: {
    date?: string;
    "dateRange.startDate"?: string;
    "dateRange.endDate"?: string;
  };
}
