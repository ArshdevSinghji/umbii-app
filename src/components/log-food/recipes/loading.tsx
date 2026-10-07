import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { THEME } from "@/lib/theme";
import { ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

// Same shell as RecipeCard; the name is boxed to its text-base line (24px).
export default function RecipesSkeleton() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="gap-3">
      {[1, 2, 3].map((item) => (
        <Card
          key={item}
          className="flex-row items-center justify-between gap-4 px-4 py-4"
        >
          <View className="h-6 flex-1 justify-center">
            <Skeleton className="h-4 w-40 rounded-full" />
          </View>
          <ChevronRight size={18} color={theme.mutedForeground} />
        </Card>
      ))}
    </View>
  );
}
