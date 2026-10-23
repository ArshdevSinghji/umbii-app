import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useAppSelector } from "@/store/hooks";
import { getInitials } from "@/utils/get-initials";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

// Opens the Profile tab (account, appearance and sign out live there and in
// Settings).
export function ProfileAvatar() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userSlice);

  return (
    <Pressable
      onPress={() => router.navigate("/(tabs)/profile")}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      <Avatar
        alt={`${user.username || "User"}'s avatar`}
        className="border border-border"
      >
        <AvatarImage
          source={{
            uri:
              user.imageUrl ??
              "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53521c4600805ff88b3bb5_peep-16.png",
          }}
        />
        <AvatarFallback>
          <Text>{getInitials(user.username)}</Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  );
}
