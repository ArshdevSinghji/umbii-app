import { MAX_AGE } from "@/components/onboarding/onboarding.types";
import {
  fromPickerDate,
  getAge,
  toPickerDate,
} from "@/components/onboarding/onboarding.utils";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useColorScheme } from "nativewind";
import { CalendarBlank } from "phosphor-react-native/src/icons/CalendarBlank";
import { useState } from "react";
import { Pressable } from "react-native";

interface IProps {
  // "YYYY-MM-DD".
  value: string | null;
  onChange: (dateOfBirth: string) => void;
}

// Where the picker opens before anything is chosen: 25 years ago.
const DEFAULT_PICKER_YEARS = 25;

const toDateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const yearsAgo = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return toDateKey(date);
};

// "12 Mar 2001", read in UTC like the picker so the day never shifts.
const formatDate = (dateKey: string) =>
  toPickerDate(dateKey).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// The date of birth from the native date picker, with the age worked out
// from it.
export default function DateOfBirthField({ value, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const age = value ? getAge(value) : null;

  return (
    <>
      <Pressable
        onPress={() => setIsPickerOpen(true)}
        className="h-14 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={
          value
            ? `Date of birth, ${formatDate(value)}`
            : "Pick your date of birth"
        }
      >
        <CalendarBlank size={20} color={theme.mutedForeground} />
        <Text
          className={cn(
            "flex-1 text-base",
            value ? "font-sans-bold" : "text-muted-foreground",
          )}
        >
          {value ? formatDate(value) : "Pick a date"}
        </Text>
        {age !== null && (
          <Text className="text-sm text-muted-foreground">{`${age} years`}</Text>
        )}
      </Pressable>

      {/* Android: opens as a dialog on mount; closed by picking or
          cancelling. */}
      {isPickerOpen && (
        <DateTimePicker
          mode="date"
          value={toPickerDate(value ?? yearsAgo(DEFAULT_PICKER_YEARS))}
          minimumDate={toPickerDate(yearsAgo(MAX_AGE))}
          maximumDate={toPickerDate(toDateKey(new Date()))}
          accentColor={theme.chart2}
          onValueChange={(_, date) => {
            setIsPickerOpen(false);
            onChange(fromPickerDate(date));
          }}
          onDismiss={() => setIsPickerOpen(false)}
        />
      )}
    </>
  );
}
