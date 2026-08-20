import { ActivityIndicator } from "react-native";
import { Text } from "./text";

interface IProps {
  isLoading: boolean;
  text: string;
}

const Loading = ({ isLoading, text }: IProps) => {
  return <>{isLoading ? <ActivityIndicator className="text-primary-foreground"/> : <Text>{text}</Text>}</>;
};

export default Loading;
