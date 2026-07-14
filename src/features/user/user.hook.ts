import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";

export function useUserActionsHook() {
  const dispatch = useAppDispatch();
  const { listFoodLogs, isLoading } = useAppSelector((state) => state.userSlice);

  const fetchFoodLogs = async (userId: number, date?: string) => {
    await dispatch(listFoodLogsAction({ userId, params: { date } }));
  };

  return {
    isLoading,
    listFoodLogs,
    fetchFoodLogs,
  };
}
