import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useAppSelector } from "@/store/hooks";
import { getInitials } from "@/utils/get-initials";
import { Camera } from "phosphor-react-native/src/icons/Camera";
import { View } from "react-native";

// Photo, name and email from the Google account. The camera badge is where
// changing the photo will go (no photo upload yet).
export default function ProfileHeader() {
  const { user } = useAppSelector((state) => state.userSlice);

  return (
    <View className="items-center gap-3">
      <View>
        <Avatar
          alt={`${user.username || "User"}'s photo`}
          className="size-24 border-2 border-white/20"
        >
          {user.imageUrl ? (
            <AvatarImage source={{ uri: user.imageUrl }} />
          ) : null}
          <AvatarFallback>
            <Text className="font-sans-bold text-2xl">
              {getInitials(user.username)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <View className="absolute -bottom-0.5 -right-0.5 size-8 items-center justify-center rounded-full border-2 border-white/20 bg-black/80">
          <Camera size={16} color="#FFFFFF" />
        </View>
      </View>
      <View className="items-center gap-0.5">
        <Text className="font-sans-bold text-xl text-white">
          {user.username}
        </Text>
        <Text className="text-sm text-white/60">{user.email}</Text>
      </View>
    </View>
  );
}
