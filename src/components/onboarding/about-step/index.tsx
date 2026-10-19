import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { CalendarBlank } from "phosphor-react-native/src/icons/CalendarBlank";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { MAX_AGE, Sex } from "../onboarding.types";
import { fromPickerDate, getAge, toPickerDate } from "../onboarding.utils";

interface IProps {
  sex: Sex | null;
  dateOfBirth: string | null;
  onSexChange: (sex: Sex) => void;
  onDateOfBirthChange: (dateOfBirth: string) => void;
}

const SEXES: { value: Sex; label: string }[] = [
  { value: Sex.Male, label: "Male" },
  { value: Sex.Female, label: "Female" },
];

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

// Sex as a two-way switch; date of birth from the native date picker, with
// the age worked out from it.
export default function AboutStep({
  sex,
  dateOfBirth,
  onSexChange,
  onDateOfBirthChange,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const age = dateOfBirth ? getAge(dateOfBirth) : null;

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Sex</Text>
        <View className="flex-row gap-1.5 rounded-2xl bg-card p-1.5">
          {SEXES.map((option) => {
            const isSelected = option.value === sex;
            return (
              <Pressable
                key={option.value}
                onPress={() => onSexChange(option.value)}
                className={cn(
                  "h-11 flex-1 items-center justify-center rounded-xl active:opacity-70",
                  isSelected && "bg-primary",
                )}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  className={cn(
                    "font-sans-bold text-sm",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Date of birth</Text>
        <Pressable
          onPress={() => setIsPickerOpen(true)}
          className="h-14 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={
            dateOfBirth
              ? `Date of birth, ${formatDate(dateOfBirth)}`
              : "Pick your date of birth"
          }
        >
          <CalendarBlank size={20} color={theme.mutedForeground} />
          <Text
            className={cn(
              "flex-1 text-base",
              dateOfBirth ? "font-sans-bold" : "text-muted-foreground",
            )}
          >
            {dateOfBirth ? formatDate(dateOfBirth) : "Pick a date"}
          </Text>
          {age !== null && (
            <Text className="text-sm text-muted-foreground">
              {`${age} years`}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Android: opens as a dialog on mount; closed by picking or
          cancelling. */}
      {isPickerOpen && (
        <DateTimePicker
          mode="date"
          value={toPickerDate(dateOfBirth ?? yearsAgo(DEFAULT_PICKER_YEARS))}
          minimumDate={toPickerDate(yearsAgo(MAX_AGE))}
          maximumDate={toPickerDate(toDateKey(new Date()))}
          accentColor={theme.chart2}
          onValueChange={(_, date) => {
            setIsPickerOpen(false);
            onDateOfBirthChange(fromPickerDate(date));
          }}
          onDismiss={() => setIsPickerOpen(false)}
        />
      )}
    </View>
  );
}
