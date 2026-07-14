import { IFoodLogDetail } from "@/features/user/user.types";

export const calculateNutrition = (data: IFoodLogDetail[]) =>
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
