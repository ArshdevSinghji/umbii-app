import SettingsRow from "@/components/settings-list/settings-row";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { Platform } from "react-native";
import { dateToTime, formatTime, timeToDate } from "../notifications.utils";

interface IProps {
  label: string;
  icon?: PhosphorIcon;
  // "HH:mm"
  value: string;
  onChange: (value: string) => void;
}

// A settings row that picks a time. Android opens the system clock dialog
// (the picker's recommended imperative API); iOS shows its compact picker
// in the row.
export default function TimeRow({ label, icon, value, onChange }: IProps) {
  if (Platform.OS === "ios") {
    return (
      <SettingsRow
        label={label}
        icon={icon}
        accessory={
          <DateTimePicker
            mode="time"
            display="compact"
            value={timeToDate(value)}
            onValueChange={(_event, date) => onChange(dateToTime(date))}
          />
        }
      />
    );
  }

  const open = () =>
    DateTimePickerAndroid.open({
      mode: "time",
      value: timeToDate(value),
      onValueChange: (_event, date) => {
        const next = dateToTime(date);
        if (next !== value) onChange(next);
      },
    });

  return (
    <SettingsRow
      label={label}
      icon={icon}
      value={formatTime(value)}
      onPress={open}
    />
  );
}
