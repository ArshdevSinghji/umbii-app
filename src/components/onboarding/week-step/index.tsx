import ActivityPicker from "@/components/profile-fields/activity-picker";
import SessionLengthPicker from "@/components/profile-fields/session-length-picker";
import TrainingTypePicker from "@/components/profile-fields/training-type-picker";
import WorkoutsPicker from "@/components/profile-fields/workouts-picker";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
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
  const trains = (workoutsPerWeek ?? 0) > 0;

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Workouts per week</Text>
        <WorkoutsPicker value={workoutsPerWeek} onChange={onWorkoutsChange} />
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
            <TrainingTypePicker
              value={trainingType}
              onChange={onTrainingTypeChange}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm text-muted-foreground">
              Average session length (min)
            </Text>
            <SessionLengthPicker
              value={avgSessionMinutes}
              onChange={onSessionChange}
            />
          </View>
        </>
      )}

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">
          The rest of your day
        </Text>
        <ActivityPicker value={activityLevel} onChange={onActivityChange} />
      </View>
    </View>
  );
}
