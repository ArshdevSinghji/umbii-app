export interface GetNutritionTargetReportRequest {
  userId: number;
  params?: {
    date?: string;
    "dateRange.startDate"?: string;
    "dateRange.endDate"?: string;
  };
}

export interface NutritionTargetReportResponse {
  completedDates: string[];
  notCompleteDates: string[];
  missedDates: string[];
}
