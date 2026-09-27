import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";
import { getFoodLogAction } from "./get-food-log/get-food-log.action";
import { IFoodLogDetail } from "./food-logs.types";

export function useFoodLogsActionsHook() {
  const dispatch = useAppDispatch();
  const { listFoodLogs, isLoading, selectedFoodLog, isFoodLogLoading } = useAppSelector(
    (state) => state.foodLogsSlice,
  );

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

  const createFoodLogs = async (userId: number, rawInputText: string, details: Omit<IFoodLogDetail, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    await dispatch(createFoodLogsAction({ userId, rawInputText, details })).unwrap();
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
    createFoodLogs,
    generateFoodLogs,
    selectedFoodLog,
    isFoodLogLoading,
    fetchFoodLogById,
  };
}
