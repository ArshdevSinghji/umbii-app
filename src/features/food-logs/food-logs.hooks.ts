import { toLocalDateKey } from "@/utils/date";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";
import { getFoodLogAction } from "./get-food-log/get-food-log.action";
import { IFoodLogDetail } from "./food-logs.types";
import { listPeriodFoodLogsAction } from "./list-period-food-logs/list-period-food-logs.action";
import { listRecentFoodLogsAction } from "./list-recent-food-logs/list-recent-food-logs.action";

export function useFoodLogsActionsHook() {
  const dispatch = useAppDispatch();
  const {
    listFoodLogs,
    isLoading,
    selectedFoodLog,
    isFoodLogLoading,
    recentFoodLogs,
    isListLoading,
    periodFoodLogs,
    isPeriodFoodLogsLoading,
  } = useAppSelector((state) => state.foodLogsSlice);

  const fetchFoodLogs = async (
    userId: number,
    params?: {
      date?: string;
      startDate?: string;
      endDate?: string;
      order?: "asc" | "desc";
    },
  ) => {
    await dispatch(
      listFoodLogsAction({
        userId,
        params: {
          date: params?.date,
          "dateRange.startDate": params?.startDate,
          "dateRange.endDate": params?.endDate,
          order: params?.order,
        },
      }),
    ).unwrap();
  };

  // Breakdown's period; separate from Home's day so neither overwrites the other.
  const fetchPeriodFoodLogs = async (
    userId: number,
    params: { startDate: string; endDate: string },
  ) => {
    await dispatch(
      listPeriodFoodLogsAction({
        userId,
        params: {
          "dateRange.startDate": params.startDate,
          "dateRange.endDate": params.endDate,
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
          "dateRange.startDate": toLocalDateKey(start),
          "dateRange.endDate": toLocalDateKey(end),
          // Newest first, so the latest meals lead the list (new logs are
          // added at the top too).
          order: "desc",
        },
      }),
    ).unwrap();
  };

  // `recipeId` links the meal to the recipe it was logged from.
  const createFoodLogs = async (
    userId: number,
    rawInputText: string,
    details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[],
    recipeId?: number,
  ) => {
    // Returns the saved log (with its id); the slice adds it to the lists.
    return await dispatch(
      createFoodLogsAction({ userId, rawInputText, details, recipeId }),
    ).unwrap();
  };

  const generateFoodLogs = async (userId: number, rawInputText: string) => {
    await dispatch(generateFoodLogsAction({ userId, rawInputText })).unwrap();
  };

  const fetchFoodLogById = async (userId: number, foodLogId: number) => {
    await dispatch(getFoodLogAction({ userId, foodLogId })).unwrap();
  };

  return {
    isLoading,
    listFoodLogs,
    fetchFoodLogs,
    isListLoading,
    periodFoodLogs,
    isPeriodFoodLogsLoading,
    fetchPeriodFoodLogs,
    recentFoodLogs,
    fetchRecentFoodLogs,
    createFoodLogs,
    generateFoodLogs,
    selectedFoodLog,
    isFoodLogLoading,
    fetchFoodLogById,
  };
}
