import { IFoodLog } from "@/features/user/user.types";

export type MealSectionLabel =
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

export type CategorizedSection = {
  label: MealSectionLabel;
  logs: IFoodLog[];
  totalCalories: number;
};

export function categorizeFoodLogs(logs: IFoodLog[]): CategorizedSection[] {
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
