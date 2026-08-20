import { IFoodLogDetail } from "../food-logs.types";

export interface GenerateFoodLogsRequest {
    userId: number;
    rawInputText: string;
}

export interface GenerateFoodLogsResponse {
    remark: string;
    rawInputText: string;
    details: Omit<IFoodLogDetail, 'id' | 'createdAt' | 'updatedAt'>[];
}