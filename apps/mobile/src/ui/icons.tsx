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

export const BackIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" />
  </Icon>
);

export const DirectionsIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M3 11l18-8-8 18-2-8z" />
  </Icon>
);

export const CheckInIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <Path d="M9.5 9l2 2 3.5-3.5" />
  </Icon>
);

export const StarIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </Icon>
);

export const PhotoIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <Circle cx={9} cy={10} r={2} />
    <Path d="M21 16l-5-5-9 9" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
    <Path d="M8.5 12l2.5 2.5 4.5-5" />
  </Icon>
);

export const WarningIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M12 3L2 20h20z" />
    <Path d="M12 10v4M12 17v.5" />
  </Icon>
);

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={12} cy={12} r={4} />
    <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const WindIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" />
  </Icon>
);

export const RainIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M7 15a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.5A3.5 3.5 0 0 1 17 15z" />
    <Path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" />
  </Icon>
);

export const EyeIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <Circle cx={12} cy={12} r={3} />
  </Icon>
);

export const TramIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M8 6h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" />
    <Path d="M5 12h14M8 21l1.5-3M16 21l-1.5-3M9 3h6M12 3v3" />
  </Icon>
);

export const BusIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <Path d="M4 11h16M7 20v-3M17 20v-3" />
  </Icon>
);

export const WalkIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={13} cy={4} r={2} />
    <Path d="M10 21l2-6-3-3 1-5 4 3 3 1M9 12l-3 2" />
  </Icon>
);

export const FerryIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0" />
    <Path d="M5 14l1-5h12l1 5M9 9V6h6v3" />
  </Icon>
);

export const ChevronIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M9 6l6 6-6 6" />
  </Icon>
);

export const LocateIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx={12} cy={12} r={7} />
    <Circle cx={12} cy={12} r={2.5} />
    <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
);

export const ThumbIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7" />
  </Icon>
);

export const CommentIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M4 5h16v11H9l-5 4z" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <Path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
