import ChoiceCard from "@/components/onboarding/choice-card";
import { ActivityLevel } from "@/features/user/user.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Chair } from "phosphor-react-native/src/icons/Chair";
import { HardHat } from "phosphor-react-native/src/icons/HardHat";
import { PersonSimpleWalk } from "phosphor-react-native/src/icons/PersonSimpleWalk";
import { View } from "react-native";

interface IProps {
  value: ActivityLevel | null;
  onChange: (activityLevel: ActivityLevel) => void;
}

const ACTIVITIES = [
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

// How active the day is outside workouts.
export default function ActivityPicker({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="gap-2">
      {ACTIVITIES.map(({ value: level, title, subtitle, Icon }) => (
        <ChoiceCard
          key={level}
          title={title}
          subtitle={subtitle}
          icon={<Icon size={20} color={theme.foreground} />}
          isSelected={level === value}
          onPress={() => onChange(level)}
        />
      ))}
    </View>
  );
}
