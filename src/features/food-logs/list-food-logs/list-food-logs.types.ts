export interface ListFoodLogsRequest {
  userId: number;
  params?: {
    date?: string;
  };
}