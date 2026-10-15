import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";

interface IProps {
  // Top-right of the page, e.g. the period dropdown.
  action?: ReactNode;
}

export default function BreakdownHeader({ action }: IProps) {
  return (
    <View className="mb-2 flex-row items-center justify-between gap-4">
      <Text className="font-sans-bold text-lg">Stats</Text>
      {action}
    </View>
  );
}
