import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { Svg, Circle, G } from 'react-native-svg';
import { View } from 'react-native';

interface IProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  trackStrokeWidth?: number;
  color: string;
  arcAngle?: number; // how much of the circle to show, default 270
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  max,
  size = 56,
  strokeWidth = 5,
  trackStrokeWidth = strokeWidth,
  color,
  arcAngle = 270,
  children,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const arcLength = (arcAngle / 360) * circumference;
  const gapLength = circumference - arcLength;
  const progress = Math.min(value / max, 1);

  // rotation: 135° places the start at bottom-left (7:30 position)
  // gap naturally falls at the bottom
  const rotation = 90 + (360 - arcAngle) / 2;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation={rotation} origin={`${center}, ${center}`}>
          {/* track — partial arc */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.border}
            strokeWidth={trackStrokeWidth}
            fill="transparent"
            strokeDasharray={[arcLength, gapLength]}
            strokeLinecap="round"
          />
          {/* progress arc */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={[progress * arcLength, circumference - progress * arcLength]}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {children}
    </View>
  );
}