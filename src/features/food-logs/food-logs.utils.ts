import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";

const calculateNutrition = (data: IFoodLogDetail[]) =>
  data.reduce(
    (acc, detail) => {
      acc.calories += Number(detail.calories ?? 0);
      acc.protein += Number(detail.protein ?? 0);
      acc.carbs += Number(detail.carbs ?? 0);
      acc.fats += Number(detail.fats ?? 0);
      acc.fiber += Number(detail.fiber ?? 0);
      acc.sugar += Number(detail.sugar ?? 0);
      acc.sodium += Number(detail.sodium ?? 0);

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

export { calculateNutrition };
