import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNutritionTargetAction } from "./create-nutrition-target/create-nutrition-target.action";
import { getNutritionTargetReportAction } from "./get-nutrition-target-report/get-nutrition-target-report.action";
import { getNutritionTargetAction } from "./get-nutrition-target/get-nutrition-target.action";
import { generateNutritionTargetAction } from "./generate-nutrition-target/generate-nutrition-target.action";
import { getPeriodNutritionTargetAction } from "./get-period-nutrition-target/get-period-nutrition-target.action";
import { getCalendarNutritionTargetReportAction } from "./get-calendar-nutrition-target-report/get-calendar-nutrition-target-report.action";

export function useNutritionTargetActionsHook() {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    isReportLoading,
    nutritionTarget,
    report,
    periodNutritionTarget,
    isPeriodTargetLoading,
    calendarReport,
    isCalendarReportLoading,
    isGenerating,
  } = useAppSelector((state) => state.nutritionTargetSlice);

  const createNutritionTarget = async (
    userId: number,
    values: NutritionValues,
  ) => {
    await dispatch(createNutritionTargetAction({ userId, ...values })).unwrap();
  };

  // Home's target. No params: the current target. `date`: one day.
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

  // Breakdown's target for the selected day (`date`) or period
  // (`startDate`/`endDate`), kept apart from Home's.
  const fetchPeriodNutritionTarget = async (
    userId: number,
    params: { date?: string; startDate?: string; endDate?: string },
  ) => {
    await dispatch(
      getPeriodNutritionTargetAction({
        userId,
        params: {
          date: params.date,
          "dateRange.startDate": params.startDate,
          "dateRange.endDate": params.endDate,
        },
      }),
    ).unwrap();
  };

  // Breakdown's calendar month report, kept apart from Home's week report.
  const fetchCalendarNutritionTargetReport = async (
    userId: number,
    params: { startDate: string; endDate: string },
  ) => {
    await dispatch(
      getCalendarNutritionTargetReportAction({
        userId,
        params: {
          "dateRange.startDate": params.startDate,
          "dateRange.endDate": params.endDate,
        },
      }),
    ).unwrap();
  };

  // Works out a new target from the profile and latest weigh-in. Resolves
  // with it (including the safety notes that applied).
  const generateNutritionTarget = async (userId: number) => {
    return await dispatch(generateNutritionTargetAction({ userId })).unwrap();
  };

  return {
    isGenerating,
    generateNutritionTarget,
    isLoading,
    isReportLoading,
    nutritionTarget,
    report,
    createNutritionTarget,
    fetchNutritionTarget,
    fetchNutritionTargetReport,
    periodNutritionTarget,
    isPeriodTargetLoading,
    fetchPeriodNutritionTarget,
    calendarReport,
    isCalendarReportLoading,
    fetchCalendarNutritionTargetReport,
  };
}
