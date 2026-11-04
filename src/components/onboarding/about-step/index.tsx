import DateOfBirthField from "@/components/profile-fields/date-of-birth-field";
import SexPicker from "@/components/profile-fields/sex-picker";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { Sex } from "../onboarding.types";

interface IProps {
  sex: Sex | null;
  dateOfBirth: string | null;
  onSexChange: (sex: Sex) => void;
  onDateOfBirthChange: (dateOfBirth: string) => void;
}

// Sex as a two-way switch; date of birth from the native date picker.
export default function AboutStep({
  sex,
  dateOfBirth,
  onSexChange,
  onDateOfBirthChange,
}: IProps) {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Sex</Text>
        <SexPicker value={sex} onChange={onSexChange} />
      </View>

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Date of birth</Text>
        <DateOfBirthField value={dateOfBirth} onChange={onDateOfBirthChange} />
      </View>
    </View>
  );
}
