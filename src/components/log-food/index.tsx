import { View } from "react-native";
import FoodInput from "./food-input/index,";

export default function LogFoodComponent() {
  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <FoodInput />
    </View>
  );
}
