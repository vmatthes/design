import type { SvgProps } from "react-native-svg"

export interface IconProps extends Omit<SvgProps, "color"> {
  /** Sets width and height at once. Defaults to 16. */
  size?: number | string
  /** Fill color of the icon. Defaults to `currentColor`. */
  color?: string
}
