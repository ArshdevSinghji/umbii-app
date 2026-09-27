import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";

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
    <View className="flex-row bg-muted rounded-full p-1">
      {PERIODS.map((period) => {
        const isActive = period.value === value;

        return (
          <Pressable
            key={period.value}
            onPress={() => onChange(period.value)}
            className={cn(
              "flex-1 items-center justify-center rounded-full py-2",
              isActive && "bg-background",
            )}
            style={
              isActive
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : undefined
            }
          >
            <Text
              className={cn(
                "text-sm font-sans-bold",
                !isActive && "text-muted-foreground",
              )}
            >
              {period.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
