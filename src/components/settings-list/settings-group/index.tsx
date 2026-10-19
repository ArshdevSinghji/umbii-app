import { Text } from "@/components/ui/text";
import { Children, Fragment, ReactNode } from "react";
import { View } from "react-native";

interface IProps {
  // Small heading above the group.
  title?: string;
  children: ReactNode;
}

// A rounded block of rows with hairlines between them.
export default function SettingsGroup({ title, children }: IProps) {
  const rows = Children.toArray(children).filter(Boolean);

  return (
    <View className="gap-2">
      {title && (
        <Text className="px-1 text-xs text-muted-foreground">{title}</Text>
      )}
      <View className="overflow-hidden rounded-2xl bg-card">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 && <View className="ml-14 h-px bg-border" />}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
