export interface GetNutritionTargetRequest {
  userId: number;
  params?: {
    // The target in effect on this day.
    date?: string;
    // Or a period (inclusive); takes precedence over `date`.
    "dateRange.startDate"?: string;
    "dateRange.endDate"?: string;
  };
}
