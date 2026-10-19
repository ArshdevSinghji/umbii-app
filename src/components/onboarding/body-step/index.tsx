import MeasurementField from "@/components/health-details/measurement-field";
import {
  HEIGHT_RANGE,
  WEIGHT_RANGE,
} from "@/components/health-details/health-details.schema";
import { View } from "react-native";

interface IProps {
  height: number;
  weight: number;
  onHeightChange: (height: number) => void;
  onWeightChange: (weight: number) => void;
}

// The same rulers as Goals' health details, so they look and feel the same.
export default function BodyStep({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: IProps) {
  return (
    <View className="gap-8">
      <MeasurementField
        label="Height"
        unit="cm"
        range={HEIGHT_RANGE}
        value={height}
        onChange={onHeightChange}
      />
      <MeasurementField
        label="Current weight"
        unit="kg"
        range={WEIGHT_RANGE}
        value={weight}
        onChange={onWeightChange}
      />
    </View>
  );
}
