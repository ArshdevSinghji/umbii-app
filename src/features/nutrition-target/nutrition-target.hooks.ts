import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNutritionTargetAction } from "./create-nutrition-target/create-nutrition-target.action";
import { getNutritionTargetReportAction } from "./get-nutrition-target-report/get-nutrition-target-report.action";
import { getNutritionTargetAction } from "./get-nutrition-target/get-nutrition-target.action";

export function useNutritionTargetActionsHook() {
  const dispatch = useAppDispatch();
  const { isLoading, isReportLoading, nutritionTarget, report } = useAppSelector(
    (state) => state.nutritionTargetSlice,
  );

  const createNutritionTarget = async (userId: number, values: NutritionValues) => {
    await dispatch(createNutritionTargetAction({ userId, ...values })).unwrap();
  };

  // No params: the current target. `date`: one day. `startDate`/`endDate`:
  // a period (Breakdown's week / month / year).
  const fetchNutritionTarget = async (
    userId: number,
    params?: { date?: string; startDate?: string; endDate?: string },
  ) => {
    await dispatch(
      getNutritionTargetAction({
        userId,
        params: {
          date: params?.date,
          "dateRange.startDate": params?.startDate,
          "dateRange.endDate": params?.endDate,
        },
      }),
    ).unwrap();
  };

  const fetchNutritionTargetReport = async (
    userId: number,
    params?: { date?: string; startDate?: string; endDate?: string },
  ) => {
    await dispatch(
      getNutritionTargetReportAction({
        userId,
        params: {
          date: params?.date,
          "dateRange.startDate": params?.startDate,
          "dateRange.endDate": params?.endDate,
        },
      }),
    ).unwrap();
  };

  return {
    isLoading,
    isReportLoading,
    nutritionTarget,
    report,
    createNutritionTarget,
    fetchNutritionTarget,
    fetchNutritionTargetReport,
  };
}
