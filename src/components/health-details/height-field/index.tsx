import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  HeightUnit,
  cmToFeet,
  feetToCm,
  formatFeetAndInches,
} from "@/utils/convert-height";
import { useState } from "react";
import { HEIGHT_RANGE } from "../health-details.schema";
import MeasurementField from "../measurement-field";

const UNITS: { label: string; value: HeightUnit }[] = [
  { label: "cm", value: "cm" },
  { label: "ft", value: "ft" },
];

// The picker makes every 10th tick long, counting from `min`, so start on a
// whole foot to keep long ticks on whole numbers. Anything under the cm
// minimum is still rejected by the schema.
const FEET_RANGE = {
  min: Math.floor(cmToFeet(HEIGHT_RANGE.min)),
  max: cmToFeet(HEIGHT_RANGE.max),
  step: 0.1,
};

interface IProps {
  // Always in cm; feet are only for display.
  value: number;
  onChange: (cm: number) => void;
  error?: string;
}

export default function HeightField({ value, onChange, error }: IProps) {
  const [unit, setUnit] = useState<HeightUnit>("cm");
  const isFeet = unit === "ft";

  const handleChange = (next: number) => onChange(isFeet ? feetToCm(next) : next);

  return (
    <MeasurementField
      // Remount the picker so it picks up the new range and starting value.
      key={unit}
      label="Height"
      unit={unit}
      range={isFeet ? FEET_RANGE : HEIGHT_RANGE}
      value={isFeet ? cmToFeet(value) : value}
      onChange={handleChange}
      error={error}
      hint={isFeet ? formatFeetAndInches(value) : undefined}
      action={<SegmentedControl options={UNITS} value={unit} onChange={setUnit} />}
    />
  );
}
