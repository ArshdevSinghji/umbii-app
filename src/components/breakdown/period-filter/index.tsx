import { SegmentedControl } from "@/components/ui/segmented-control";

export type StatsPeriod = "day" | "week" | "month" | "year";

const PERIODS: { label: string; value: StatsPeriod }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

interface IProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export default function PeriodFilter({ value, onChange }: IProps) {
  return (
    <SegmentedControl options={PERIODS} value={value} onChange={onChange} fill />
  );
}
