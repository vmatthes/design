/**
 * Design tokens of letmeshowyou and Rudel, the one source for all apps.
 * `pnpm --filter @volkermatthes/design generate` writes them as CSS variables
 * (tokens.css, imported by each globals.css) and as Swift (`Tokens` in
 * packages/DesignKit). Edit here, never in the generated files.
 *
 * Warm off-white ground, near-black ink, white cards and pill controls.
 * Dark theme: warm near-black ground, slightly lifted cards. Inverted cards
 * ("Dunkel" blocks, toolbars, banners) are dark on the light theme and light
 * on the dark theme, so they always stand out.
 */

export type ColorToken = {
  /** Kebab-case name: `--name` in CSS, camelCase in Swift. */
  name: string
  light: string
  dark: string
  /** Also a Tailwind color (`bg-name`, `text-name`). Default true. */
  tailwind?: boolean
  /** Only emitted for these platforms. Default both. */
  platforms?: readonly ("css" | "swift")[]
  comment?: string
}

export const COLORS: readonly ColorToken[] = [
  { name: "background", light: "#f2f1ec", dark: "#141413" },
  { name: "foreground", light: "#1a1a1a", dark: "#edece7" },
  { name: "card", light: "#ffffff", dark: "#1f1f1d" },
  { name: "card-foreground", light: "#1a1a1a", dark: "#edece7" },
  { name: "popover", light: "#ffffff", dark: "#252523" },
  { name: "popover-foreground", light: "#1a1a1a", dark: "#edece7" },
  { name: "primary", light: "#1a1a1a", dark: "#edece7" },
  { name: "primary-foreground", light: "#ffffff", dark: "#141413" },
  { name: "secondary", light: "#ffffff", dark: "#1f1f1d" },
  { name: "secondary-foreground", light: "#1a1a1a", dark: "#edece7" },
  { name: "muted", light: "#f2f1ec", dark: "#2a2a27" },
  { name: "muted-foreground", light: "#5e5e58", dark: "#a8a7a0" },
  { name: "accent", light: "#e8e6df", dark: "#363632" },
  { name: "accent-foreground", light: "#1a1a1a", dark: "#edece7" },
  { name: "destructive", light: "#b42318", dark: "#f97066" },
  { name: "destructive-soft", light: "#fbede9", dark: "#3a1d1a" },
  { name: "border", light: "#eeede8", dark: "#2c2c29" },
  { name: "input", light: "#e2e0d8", dark: "#3a3a36" },
  { name: "ring", light: "#1a1a1a", dark: "#edece7" },

  {
    name: "ink-soft",
    light: "#3a3a36",
    dark: "#d6d5cf",
    comment: "Text shades, all ≥ 4.5:1 on the ground and on cards.",
  },
  { name: "ink-muted", light: "#4f4f4a", dark: "#c2c1ba" },
  { name: "sunken", light: "#e8e6df", dark: "#2a2a27" },
  { name: "placeholder", light: "#8e8d89", dark: "#85847e" },

  {
    name: "ink-card",
    light: "#1a1a1a",
    dark: "#edece7",
    comment: "Inverted cards: dark on light, light on dark.",
  },
  { name: "ink-card-foreground", light: "#ffffff", dark: "#1a1a1a" },
  { name: "ink-card-muted", light: "#bdbdb6", dark: "#5e5e58" },
  { name: "ink-card-soft", light: "#d6d6d0", dark: "#3a3a36" },
  { name: "ink-card-chip", light: "#333330", dark: "#dcdad3" },
  { name: "ink-card-chip-hover", light: "#444440", dark: "#cfcdc5" },

  {
    name: "on-accent",
    light: "#1a1a1a",
    dark: "#1a1a1a",
    comment: "Text on accent colors stays ink in both themes.",
  },
  {
    name: "scrim",
    light: "rgb(20 20 19 / 0.35)",
    dark: "rgb(0 0 0 / 0.6)",
    platforms: ["css"],
    comment: "Behind dialogs (iOS sheets dim on their own).",
  },
  {
    name: "drop",
    light: "#2f80ed",
    dark: "#5aa0f2",
    comment: "Drop line while dragging, and selected items.",
  },

  {
    name: "grabber",
    light: "#c9c7c0",
    dark: "#4a4a45",
    platforms: ["swift"],
    comment: "Sheet grabbers.",
  },
  {
    name: "dashed",
    light: "#cfcdc5",
    dark: "#4a4a45",
    platforms: ["swift"],
    comment: "Dashed outlines of add buttons.",
  },

  // Text colors inside notes (<span data-color> in their Markdown).
  ...(
    [
      ["gray", "#787774", "#9b9b9b"],
      ["brown", "#9f6b53", "#ba856f"],
      ["orange", "#d9730d", "#c77d48"],
      ["yellow", "#cb912f", "#ca9849"],
      ["green", "#448361", "#529e72"],
      ["blue", "#337ea9", "#5e87c9"],
      ["purple", "#9065b0", "#9d68d3"],
      ["pink", "#c14c8a", "#d15796"],
      ["red", "#d44c47", "#df5452"],
    ] as const
  ).map(([name, light, dark]) => ({
    name: `inline-${name}`,
    light,
    dark,
    tailwind: false,
  })),
]

/** CSS-only values per theme (shadows, menu geometry, shadcn's radius). */
export const CSS_VALUES: readonly {
  name: string
  light: string
  dark?: string
  tailwind?: boolean
  comment?: string
}[] = [
  { name: "radius", light: "1rem" },
  {
    name: "shadow-card",
    light: "0 1px 2px rgb(0 0 0 / 0.04), 0 6px 20px rgb(0 0 0 / 0.04)",
    dark: "0 1px 2px rgb(0 0 0 / 0.3), 0 6px 20px rgb(0 0 0 / 0.25)",
    tailwind: true,
  },
  {
    name: "shadow-float",
    light: "0 24px 60px rgb(0 0 0 / 0.22)",
    dark: "0 24px 60px rgb(0 0 0 / 0.6)",
    tailwind: true,
  },
  {
    name: "menu-radius",
    light: "18px",
    comment:
      "Menus and select lists: items sit inset in the popover, so their corners are concentric with it (item radius = popover radius - inset).",
  },
  { name: "menu-inset", light: "5px" },
]

/**
 * Accent colors of the brand palette: collection colors in letmeshowyou,
 * member colors in Rudel. Text on them is always ink (#1A1A1A).
 */
export const ACCENT_COLORS = [
  { value: "#F7C548", name: "Gelb" },
  { value: "#F5A962", name: "Pfirsich" },
  { value: "#F08A6E", name: "Koralle" },
  { value: "#F07F8F", name: "Kirsche" },
  { value: "#EE9BC4", name: "Rosa" },
  { value: "#C9A2E6", name: "Flieder" },
  { value: "#A99BEF", name: "Lavendel" },
  { value: "#8FA8F2", name: "Ozean" },
  { value: "#7DB7E8", name: "Himmel" },
  { value: "#6FCBD3", name: "Türkis" },
  { value: "#7FD1AE", name: "Mint" },
  { value: "#8DBF8B", name: "Salbei" },
  { value: "#BCC86B", name: "Olive" },
  { value: "#D8C49E", name: "Sand" },
  { value: "#C4B5A5", name: "Taupe" },
  { value: "#BDBDB6", name: "Grau" },
] as const
