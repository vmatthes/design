import type { SVGProps } from "react"

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  /** Sets width and height at once. Defaults to 16. */
  size?: number | string
  /** Fill color of the icon. Defaults to `currentColor`. */
  color?: string
}
