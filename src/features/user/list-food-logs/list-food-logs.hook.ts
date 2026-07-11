import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { listFoodLogsAction } from "./list-food-logs.action";

interface IParams {
  userId: number;
  date?: string;
  runOnLoad?: boolean;
}

export function useListFoodLogsHook(payload: IParams) {
  const { userId, date, runOnLoad = false } = payload;

  const dispatch = useAppDispatch();
  const { listFoodLogs } = useAppSelector((state) => state.userSlice);

  const [isLoading, setIsLoading] = useState(false);

  const fetchFoodLogs = async (userId: number, date?: string) => {
    setIsLoading(true);
    await dispatch(listFoodLogsAction({ userId, params: { date } }));
    setIsLoading(false);
  };

  useEffect(() => {
    if (runOnLoad) fetchFoodLogs(userId, date);
  }, [userId, date]);

  return {
    isLoading,
    listFoodLogs,
    fetchFoodLogs,
  };
}
