import { View } from "react-native";
import FoodInput from "./food-input";

interface IProps {
  onComposerHeightChange?: (height: number) => void;
}

export default function LogFoodComponent({ onComposerHeightChange }: IProps) {
  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <FoodInput onHeightChange={onComposerHeightChange} />
    </View>
  );
}
