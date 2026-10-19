import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Chair } from "phosphor-react-native/src/icons/Chair";
import { HardHat } from "phosphor-react-native/src/icons/HardHat";
import { PersonSimpleWalk } from "phosphor-react-native/src/icons/PersonSimpleWalk";
import { View } from "react-native";
import ChoiceCard from "../choice-card";
import ChoiceChip from "../choice-chip";
import { ActivityLevel, TrainingType } from "../onboarding.types";

interface IProps {
  workoutsPerWeek: number | null;
  activityLevel: ActivityLevel | null;
  trainingType: TrainingType | null;
  avgSessionMinutes: number | null;
  onWorkoutsChange: (workouts: number) => void;
  onActivityChange: (activityLevel: ActivityLevel) => void;
  onTrainingTypeChange: (trainingType: TrainingType) => void;
  onSessionChange: (minutes: number) => void;
}

const WORKOUT_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

const TRAINING_TYPES: { value: TrainingType; label: string }[] = [
  { value: TrainingType.Lifting, label: "Lifting" },
  { value: TrainingType.Cardio, label: "Cardio" },
  { value: TrainingType.Mixed, label: "Mixed" },
  { value: TrainingType.Sport, label: "Sport/other" },
];

// Each range is stored as one number of minutes: its midpoint, or a typical
// length at the open ends.
const SESSION_LENGTHS: { minutes: number; label: string }[] = [
  { minutes: 20, label: "Under 30" },
  { minutes: 38, label: "30-45" },
  { minutes: 53, label: "45-60" },
  { minutes: 75, label: "60-90" },
  { minutes: 100, label: "90+" },
];

// Workouts per week, what they are and how long (only if any), then how
// active the rest of the day is.
export default function WeekStep({
  workoutsPerWeek,
  activityLevel,
  trainingType,
  avgSessionMinutes,
  onWorkoutsChange,
  onActivityChange,
  onTrainingTypeChange,
  onSessionChange,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const trains = (workoutsPerWeek ?? 0) > 0;

  const activities = [
    {
      value: ActivityLevel.Sedentary,
      title: "Mostly sitting",
      subtitle: "Desk job or studying",
      Icon: Chair,
    },
    {
      value: ActivityLevel.LightActive,
      title: "On my feet a lot",
      subtitle: "Walking, standing, errands",
      Icon: PersonSimpleWalk,
    },
    {
      value: ActivityLevel.VeryActive,
      title: "Physical work",
      subtitle: "Manual job, on the move all day",
      Icon: HardHat,
    },
  ];

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Workouts per week</Text>
        <View className="flex-row gap-1.5">
          {WORKOUT_OPTIONS.map((count) => (
            <ChoiceChip
              key={count}
              label={String(count)}
              isSelected={count === workoutsPerWeek}
              onPress={() => onWorkoutsChange(count)}
              className="h-12 flex-1 px-0"
            />
          ))}
        </View>
        <Text className="text-xs text-muted-foreground">
          Any training counts: gym, running, sport, yoga.
        </Text>
      </View>

      {trains && (
        <>
          <View className="gap-2">
            <Text className="text-sm text-muted-foreground">
              Main training type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {TRAINING_TYPES.map(({ value, label }) => (
                <ChoiceChip
                  key={value}
                  label={label}
                  isSelected={value === trainingType}
                  onPress={() => onTrainingTypeChange(value)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm text-muted-foreground">
              Average session length (min)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SESSION_LENGTHS.map(({ minutes, label }) => (
                <ChoiceChip
                  key={minutes}
                  label={label}
                  isSelected={minutes === avgSessionMinutes}
                  onPress={() => onSessionChange(minutes)}
                />
              ))}
            </View>
          </View>
        </>
      )}

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">
          The rest of your day
        </Text>
        {activities.map(({ value, title, subtitle, Icon }) => (
          <ChoiceCard
            key={value}
            title={title}
            subtitle={subtitle}
            icon={<Icon size={20} color={theme.foreground} />}
            isSelected={value === activityLevel}
            onPress={() => onActivityChange(value)}
          />
        ))}
      </View>
    </View>
  );
}
