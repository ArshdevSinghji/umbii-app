import { Image, View } from "react-native";
import { Text } from "../ui/text";
import Header from "./components/header";
import SignInButton from "./components/sign-in-button";

export default function SignInComponent() {
  return (
    <View className="pt-8 px-8 flex-1 justify-between">
      <Header />

      <View className="relative">
        <Image
          source={require("@/assets/images/food-donation-doodle-vector-charity-concept.png")}
          className="w-full h-48"
          resizeMode="contain"
        />
        <View className="absolute -top-10 left-0 right-0">
          <SignInButton />
          <Text className="text-xs text-muted-foreground text-center mt-1">
            By logging in, you agree to keep your workouts honest and your
            appetite healthy.
          </Text>
        </View>
      </View>
    </View>
  );
}
