import { useSignOut } from "@/components/dashboard/hooks/user-sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Text } from "@/components/ui/text";
import { getInitials } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ProfileDropdown() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { signOut } = useSignOut();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 4,
    right: 4,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar alt={`${user.username || "User"}'s avatar`} className="border border-primary">
          <AvatarImage
            source={{
              uri: user.imageUrl ?? "https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e53521c4600805ff88b3bb5_peep-16.png",
            }}
          />
          <AvatarFallback>
            <Text>{getInitials(user.username)}</Text>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        insets={contentInsets}
        sideOffset={2}
        className="w-56"
        align="start"
      >
        <DropdownMenuLabel className="font-sans-bold">
          {user.username}{'\n'}
          <Text className="text-xs">{user.email}</Text>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Profile</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Billing</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={signOut}>
          <Text className="text-destructive">Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
