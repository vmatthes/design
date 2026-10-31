import type { SVGProps } from "react"

import { STICKER_MARKUP, type StickerId } from "./stickers.generated"

export interface StickerProps
  extends Omit<SVGProps<SVGSVGElement>, "color" | "id"> {
  id: StickerId
  /** The motif's color, e.g. a collection's accent. */
  color: string
  /** Sets width and height at once. Defaults to 40. */
  size?: number | string
  /** Cut out along the motif: a white edge that follows the shape. */
  dieCut?: boolean
}

const DIE_CUT_FILTER =
  '<feMorphology in="SourceAlpha" operator="dilate" radius="3.4" result="d"/>' +
  '<feFlood flood-color="#FFFFFF"/><feComposite in2="d" operator="in" result="w"/>' +
  '<feGaussianBlur in="d" stdDeviation="2" result="b"/><feOffset in="b" dy="2.2" result="bo"/>' +
  '<feFlood flood-color="#000000" flood-opacity="0.18"/><feComposite in2="bo" operator="in" result="s"/>' +
  '<feMerge><feMergeNode in="s"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge>'

/** A sticker motif: ink outline, white details, the rest in `color`. */
export function Sticker({
  id,
  color,
  size = 40,
  dieCut = false,
  style,
  ...props
}: StickerProps) {
  const markup = STICKER_MARKUP[id]
  const filterId = `sticker-die-cut-${id}`
  return (
    <svg
      viewBox="-4 -4 72 72"
      width={size}
      height={size}
      {...props}
      style={
        {
          "--c": color,
          display: "block",
          overflow: dieCut ? "visible" : undefined,
          ...style,
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{
        __html: dieCut
          ? `<defs><filter id="${filterId}" x="-30%" y="-30%" width="160%" height="170%">${DIE_CUT_FILTER}</filter></defs><g filter="url(#${filterId})">${markup}</g>`
          : markup,
      }}
    />
  )
}
