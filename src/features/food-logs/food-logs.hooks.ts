import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";
import { getFoodLogAction } from "./get-food-log/get-food-log.action";
import { IFoodLogDetail } from "./food-logs.types";
import { listRecentFoodLogsAction } from "./list-recent-food-logs/list-recent-food-logs.action";

export function useFoodLogsActionsHook() {
  const dispatch = useAppDispatch();
  const {
    listFoodLogs,
    isLoading,
    selectedFoodLog,
    isFoodLogLoading,
    recentFoodLogs,
  } = useAppSelector((state) => state.foodLogsSlice);

  const fetchFoodLogs = async (
    userId: number,
    params?: { date?: string; startDate?: string; endDate?: string },
  ) => {
    await dispatch(
      listFoodLogsAction({
        userId,
        params: {
          date: params?.date,
          "dateRange.startDate": params?.startDate,
          "dateRange.endDate": params?.endDate,
        },
      }),
    ).unwrap();
  };

  // Last 7 days (today and the six before), newest first from the API.
  const fetchRecentFoodLogs = async (userId: number) => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    await dispatch(
      listRecentFoodLogsAction({
        userId,
        params: {
          "dateRange.startDate": start.toISOString().split("T")[0],
          "dateRange.endDate": end.toISOString().split("T")[0],
        },
      }),
    ).unwrap();
  };

  const createFoodLogs = async (userId: number, rawInputText: string, details: Omit<IFoodLogDetail, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    await dispatch(createFoodLogsAction({ userId, rawInputText, details })).unwrap();
    // The create response has no log in it, so refresh the recent list.
    fetchRecentFoodLogs(userId).catch(() => {});
  };

  const generateFoodLogs = async (userId: number, rawInputText: string) => {
    await dispatch(generateFoodLogsAction({ userId, rawInputText })).unwrap();
  }

  const fetchFoodLogById = async (userId: number, foodLogId: number) => {
    await dispatch(getFoodLogAction({ userId, foodLogId })).unwrap();
  };

  return {
    isLoading,
    listFoodLogs,
    fetchFoodLogs,
    recentFoodLogs,
    fetchRecentFoodLogs,
    createFoodLogs,
    generateFoodLogs,
    selectedFoodLog,
    isFoodLogLoading,
    fetchFoodLogById,
  };
}
