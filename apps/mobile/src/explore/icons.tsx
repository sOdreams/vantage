import type { ReactNode } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = { size?: number; color: string; strokeWidth?: number };

function Icon({
  size = 22,
  color,
  strokeWidth = 1.8,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={11} cy={11} r={7} />
    <Path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const BellIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
    <Path d="M10 21h4" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <Circle cx={12} cy={9} r={2.5} />
  </Icon>
);

export const SunsetIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M7 17a5 5 0 0 1 10 0" />
    <Path d="M3 17h18M12 7v2M5.6 10.6l1.4 1.4M18.4 10.6L17 12" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <Circle cx={12} cy={13} r={3.5} />
  </Icon>
);

export const SlidersIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <Circle cx={16} cy={7} r={2} />
    <Circle cx={10} cy={17} r={2} />
  </Icon>
);

export const CompassIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </Icon>
);

export const BookmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M7 3h10v18l-5-4-5 4z" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 5v14M5 12h14" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={12} cy={8} r={4} />
    <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </Icon>
);
