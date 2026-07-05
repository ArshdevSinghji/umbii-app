import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Drumstick, Flame, Ham, Milk } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function TodaysGoal() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Card className="mt-8 shadow-none px-4 gap-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm">Today's Goal</Text>
          <Text className="text-3xl font-sans-bold">
            460
            <Text className="text-xl text-muted-foreground font-sans-bold">
              {" "}
              / 1600
            </Text>
          </Text>
        </View>
        <CircularProgress
          value={34}
          max={100}
          color={theme.primary}
          size={80}
          strokeWidth={10}
          trackStrokeWidth={5}
        >
          <View className="p-1 bg-primary rounded-full">
            <Flame size={20} color={theme.background} fill={theme.background} />
          </View>
        </CircularProgress>
      </View>

      <Separator />

      <View className="flex-row justify-between px-4">
        <GoalProgress
          left={34}
          value={100 - 34}
          label="Protein left"
          color={theme.chart1}
          bgColor="bg-muted"
          icon={
            <Drumstick size={12} color={theme.primary} fill={theme.chart1} />
          }
        />

        <GoalProgress
          left={25}
          value={75}
          label="Carbs left"
          bgColor="bg-muted"
          color={theme.chart2}
          icon={<Milk size={12} color={theme.primary} fill={theme.chart2} />}
        />

        <GoalProgress
          left={14}
          value={14}
          label="Fat over"
          bgColor="bg-muted"
          color={theme.chart4}
          icon={<Ham size={12} color={theme.primary} fill={theme.chart4} />}
        />
      </View>
    </Card>
  );
}

interface IProps {
  left: number;
  value: number;
  label: string;
  color: string;
  bgColor?: string;
  icon: React.ReactNode;
}

function GoalProgress({
  left,
  value,
  label,
  color,
  bgColor = "bg-primary",
  icon,
}: IProps) {
  return (
    <View className="items-center gap-3">
      <View className="items-center">
        <Text className="font-sans-bold">{left}g</Text>
        <Text className="text-sm font-sans-bold leading-none">{label}</Text>
      </View>
      <CircularProgress
        value={value}
        max={100}
        color={color}
        strokeWidth={8}
        trackStrokeWidth={4}
      >
        <View className={cn(bgColor, "p-1", "rounded-full")}>{icon}</View>
      </CircularProgress>
    </View>
  );
}
