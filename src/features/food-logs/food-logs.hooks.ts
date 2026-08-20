import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";
import { IFoodLogDetail } from "./food-logs.types";

export function useFoodLogsActionsHook() {
  const dispatch = useAppDispatch();
  const { listFoodLogs, isLoading } = useAppSelector((state) => state.foodLogsSlice);

  const fetchFoodLogs = async (userId: number, date?: string) => {
    await dispatch(listFoodLogsAction({ userId, params: { date } })).unwrap();
  };

  const createFoodLogs = async (userId: number, rawInputText: string, details: Omit<IFoodLogDetail, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    await dispatch(createFoodLogsAction({ userId, rawInputText, details })).unwrap();
  };

  const generateFoodLogs = async (userId: number, rawInputText: string) => {
    await dispatch(generateFoodLogsAction({ userId, rawInputText })).unwrap();
  }

  return {
    isLoading,
    listFoodLogs,
    fetchFoodLogs,
    createFoodLogs,
    generateFoodLogs
  };
}
