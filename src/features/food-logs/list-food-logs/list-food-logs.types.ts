export interface ListFoodLogsRequest {
  userId: number;
  params?: {
    date?: string;
    "dateRange.startDate"?: string;
    "dateRange.endDate"?: string;
    // By log date (id breaks ties). The API defaults to "asc", oldest first.
    order?: "asc" | "desc";
  };
}
