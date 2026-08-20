import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";

const calculateNutrition = (data: IFoodLogDetail[]) =>
  data.reduce(
    (acc, detail) => {
      acc.calories += Number(detail.calories ?? 0);
      acc.protein += parseFloat(detail.protein ?? "0");
      acc.carbs += parseFloat(detail.carbs ?? "0");
      acc.fats += parseFloat(detail.fats ?? "0");
      acc.fiber += parseFloat(detail.fiber ?? "0");
      acc.sugar += parseFloat(detail.sugar ?? "0");
      acc.sodium += parseFloat(detail.sodium ?? "0");

      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
  );

type MealSectionLabel =
  | "Breakfast"
  | "Morning Snack"
  | "Lunch"
  | "Afternoon Snack"
  | "Dinner";

const SECTIONS: {
  label: MealSectionLabel;
  startHour: number;
  endHour: number;
}[] = [
  { label: "Breakfast", startHour: 5, endHour: 10 },
  { label: "Morning Snack", startHour: 10, endHour: 12 },
  { label: "Lunch", startHour: 12, endHour: 15 },
  { label: "Afternoon Snack", startHour: 15, endHour: 18 },
  { label: "Dinner", startHour: 18, endHour: 24 },
];

type CategorizedSection = {
  label: MealSectionLabel;
  logs: IFoodLog[];
  totalCalories: number;
};

function categorizeFoodLogs(logs: IFoodLog[]): CategorizedSection[] {
  return SECTIONS.map((section) => {
    const sectionLogs = logs.filter((log) => {
      const hour = new Date(log.createdAt).getHours();
      return hour >= section.startHour && hour < section.endHour;
    });

    const totalCalories = sectionLogs.reduce((total, log) => {
      return (
        total +
        log.details.reduce((sum, detail) => {
          return sum + parseFloat(detail.calories ?? "0");
        }, 0)
      );
    }, 0);

    return {
      label: section.label,
      logs: sectionLogs,
      totalCalories,
    };
  });
}

export {
  calculateNutrition,
  CategorizedSection,
  categorizeFoodLogs,
  MealSectionLabel,
};
