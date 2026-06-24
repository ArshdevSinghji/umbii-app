import { View } from "react-native";
import SignInButton from "./sign-in-button";
import TitleCard from "./title-card";

export default function SignInComponent() {
  return (
    <View className="p-8">
      <TitleCard />
      <SignInButton />
    </View>
  );
}
