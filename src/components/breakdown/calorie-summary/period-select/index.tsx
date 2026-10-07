import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { StatsPeriod } from "@/utils/get-date-range-for-period";
import { ChevronDown } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

const PERIODS: { label: string; value: StatsPeriod }[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
];

interface IProps {
  value: StatsPeriod;
  onChange: (value: StatsPeriod) => void;
}

export default function PeriodSelect({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const selected = PERIODS.find((period) => period.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <View className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-1.5">
          <Text className="text-sm font-sans-bold">{selected?.label}</Text>
          <ChevronDown size={14} color={theme.foreground} />
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-32">
        {PERIODS.map((period) => (
          <DropdownMenuItem key={period.value} onPress={() => onChange(period.value)}>
            <Text>{period.label}</Text>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
