import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import type { TriggerRef } from "@rn-primitives/popover";
import { Camera } from "phosphor-react-native/src/icons/Camera";
import { Images } from "phosphor-react-native/src/icons/Images";
import { Plus } from "phosphor-react-native/src/icons/Plus";
import { useColorScheme } from "nativewind";
import { useRef } from "react";
import { Pressable, View } from "react-native";

interface IProps {
  size: number;
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickPhoto: () => void;
}

// The composer's "+": attach a meal photo or a food bill, from the camera
// or the gallery.
export default function AttachMenu({
  size,
  disabled,
  onTakePhoto,
  onPickPhoto,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const triggerRef = useRef<TriggerRef>(null);

  // Close first, so the popover isn't still up behind the camera/picker.
  const choose = (action: () => void) => {
    triggerRef.current?.close();
    action();
  };

  const options = [
    { label: "Camera", Icon: Camera, action: onTakePhoto },
    { label: "Photos", Icon: Images, action: onPickPhoto },
  ];

  return (
    <Popover>
      <PopoverTrigger
        ref={triggerRef}
        disabled={disabled}
        hitSlop={6}
        accessibilityLabel="Add a photo"
        className="items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <Plus size={22} color={theme.foreground} />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-48 rounded-2xl p-1.5"
      >
        <View>
          {options.map(({ label, Icon, action }) => (
            <Pressable
              key={label}
              onPress={() => choose(action)}
              className="flex-row items-center gap-3 rounded-xl px-3 py-2.5 active:bg-accent"
            >
              <Icon size={20} color={theme.foreground} />
              <Text className="font-sans text-base">{label}</Text>
            </Pressable>
          ))}
        </View>
      </PopoverContent>
    </Popover>
  );
}
