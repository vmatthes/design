// Writes the icons and fonts of DesignKitAndroid: every case of `BrandIcon`
// and `DuotoneIcon` in the Swift package becomes a vector drawable and an
// enum entry with the same name, so both platforms offer the same icons. The
// SVG comes from src/svgs or, for hand-made ones (GoogleMark), from the
// imageset. Duotones become two drawables, "…_fill" and "…_line", like the
// iOS imagesets. Fonts are copied from DesignKit under resource names.
// `--check` fails instead of writing when a file is out of date.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const kit = join(root, "../DesignKit/Sources/DesignKit")
const assets = join(kit, "Resources/Icons.xcassets/Icons")
const android = join(root, "../DesignKitAndroid/src/main")
const code = join(android, "kotlin/com/volkermatthes/designkit")
const check = process.argv.includes("--check")

const fonts = {
  "Inter_400Regular.ttf": "inter_regular.ttf",
  "Inter_500Medium.ttf": "inter_medium.ttf",
  "Inter_600SemiBold.ttf": "inter_semibold.ttf",
  "Inter_700Bold.ttf": "inter_bold.ttf",
  "BricolageGrotesque_800ExtraBold.ttf": "bricolage_extrabold.ttf",
}

/** "ShoppingBagFilled" → "ic_shopping_bag_filled" */
const drawable = (name) =>
  "ic_" + name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()

// Enum entries named like a Kotlin modifier need backticks.
const modifiers = new Set(["abstract", "actual", "annotation", "companion", "const", "crossinline", "data", "enum", "expect", "external", "final", "infix", "inline", "inner", "internal", "lateinit", "noinline", "open", "operator", "out", "override", "private", "protected", "public", "reified", "sealed", "suspend", "tailrec", "vararg", "value"])
const entry = (name) => (modifiers.has(name) ? `\`${name}\`` : name)

const cases = (file) => {
  const source = readFileSync(join(kit, file), "utf8")
  return [...source.matchAll(/case (\w+) = "(\w+)"/g)].map((m) => ({
    name: m[1],
    raw: m[2],
  }))
}

/** `case .heading: return BrandIcon.heading2.rawValue` in `assetName`. */
const aliases = (file) => {
  const source = readFileSync(join(kit, file), "utf8")
  return Object.fromEntries(
    [...source.matchAll(/case \.(\w+): return \w+\.(\w+)\.rawValue/g)].map(
      (m) => [m[1], m[2]]
    )
  )
}

const readSvg = (raw) => {
  for (const path of [
    join(root, "src/svgs", `${raw}.svg`),
    join(assets, `${raw}.imageset`, `${raw}.svg`),
  ]) {
    if (existsSync(path)) return readFileSync(path, "utf8")
  }
  return null
}

const attribute = (tag, name) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]

const circlePath = (tag) => {
  const [cx, cy, r] = ["cx", "cy", "r"].map((n) => Number(attribute(tag, n)))
  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`
}

/** Shapes of an SVG in drawing order, with their effective opacity. */
function shapes(svg, name) {
  // Vector drawables have no masks. Figma's only use here is an inner stroke
  // (SpotifyFilled): without the mask and its path the shape stays intact.
  const body = svg
    .replace(/<svg[^>]*>|<\/svg>/g, "")
    .replace(/<mask[\s\S]*?<\/mask>/g, "")
    .replace(/<path[^>]*\smask="[^"]*"[^>]*\/>/g, "")
  const unsupported = body.match(/<(?!\/?(?:g|path|circle)\b)[a-zA-Z/]+/)
  if (unsupported) throw new Error(`${name}: ${unsupported[0]} is not supported`)
  const result = []
  for (const [, group, shape] of body.matchAll(
    /(<g[^>]*>[\s\S]*?<\/g>)|(<(?:path|circle)[^>]*\/>)/g
  )) {
    const groupOpacity = group ? attribute(group.match(/<g[^>]*>/)[0], "opacity") : undefined
    for (const tag of group ? group.match(/<(?:path|circle)[^>]*\/>/g) ?? [] : [shape]) {
      result.push({
        d: tag.startsWith("<circle") ? circlePath(tag) : attribute(tag, "d"),
        evenOdd: attribute(tag, "fill-rule") === "evenodd",
        opacity: attribute(tag, "opacity") ?? groupOpacity,
        stroke: attribute(tag, "stroke"),
        strokeWidth: attribute(tag, "stroke-width"),
        strokeCap: attribute(tag, "stroke-linecap"),
        strokeJoin: attribute(tag, "stroke-linejoin"),
        filled: attribute(tag, "fill") !== "none",
      })
    }
  }
  return result
}

function vector(svg, paths) {
  const [open] = svg.match(/<svg[^>]*>/)
  const [, , w, h] = attribute(open, "viewBox").split(" ").map(Number)
  const lines = [
    `<vector xmlns:android="http://schemas.android.com/apk/res/android"`,
    `    android:width="${w}dp"`,
    `    android:height="${h}dp"`,
    `    android:viewportWidth="${w}"`,
    `    android:viewportHeight="${h}">`,
  ]
  for (const p of paths) {
    const attrs = [`android:pathData="${p.d}"`]
    if (p.filled) attrs.push(`android:fillColor="#FF000000"`)
    if (p.filled && p.opacity) attrs.push(`android:fillAlpha="${p.opacity}"`)
    if (p.filled && p.evenOdd) attrs.push(`android:fillType="evenOdd"`)
    if (p.stroke) {
      attrs.push(`android:strokeColor="#FF000000"`)
      if (p.strokeWidth) attrs.push(`android:strokeWidth="${p.strokeWidth}"`)
      if (p.strokeCap) attrs.push(`android:strokeLineCap="${p.strokeCap}"`)
      if (p.strokeJoin) attrs.push(`android:strokeLineJoin="${p.strokeJoin}"`)
      if (p.opacity) attrs.push(`android:strokeAlpha="${p.opacity}"`)
    }
    lines.push(`  <path`, ...attrs.map((a) => `      ${a}`), `      />`)
  }
  return [...lines, `</vector>`, ""].join("\n")
}

const files = new Map()
const missing = []

const brandEntries = []
const brandCases = cases("BrandIcon.swift")
const brandAliases = aliases("BrandIcon.swift")
const rawOf = Object.fromEntries(brandCases.map((c) => [c.name, c.raw]))
for (const { name, raw } of brandCases) {
  const asset = brandAliases[name] ? rawOf[brandAliases[name]] : raw
  const svg = readSvg(asset)
  if (!svg) {
    missing.push(raw)
    continue
  }
  const res = drawable(asset)
  files.set(join(android, "res/drawable", `${res}.xml`), vector(svg, shapes(svg, asset)))
  brandEntries.push(`  ${entry(name)}(R.drawable.${res}),`)
}

const duotoneEntries = []
for (const { name, raw } of cases("DuotoneIcon.swift")) {
  const svg = readSvg(raw)
  if (!svg) {
    missing.push(raw)
    continue
  }
  const all = shapes(svg, raw)
  const res = drawable(raw)
  // The area is drawn solid here; the app gives it its own color.
  const fill = all
    .filter((s) => s.opacity)
    .map((s) => ({ ...s, opacity: undefined }))
  files.set(join(android, "res/drawable", `${res}_fill.xml`), vector(svg, fill))
  files.set(
    join(android, "res/drawable", `${res}_line.xml`),
    vector(svg, all.filter((s) => !s.opacity))
  )
  duotoneEntries.push(`  ${entry(name)}(R.drawable.${res}_fill, R.drawable.${res}_line),`)
}

const header = "// Generated from DesignKit's icon enums by packages/icons/scripts/android.mjs – do not edit.\n"
files.set(
  join(code, "BrandIcon.generated.kt"),
  `${header}package com.volkermatthes.designkit

import androidx.annotation.DrawableRes

/** Icons of @volkermatthes/icons (Filled variants), same names as on iOS. */
@Suppress("EnumEntryName")
enum class BrandIcon(@DrawableRes val res: Int) {
${brandEntries.join("\n")}
}
`
)
files.set(
  join(code, "DuotoneIcon.generated.kt"),
  `${header}package com.volkermatthes.designkit

import androidx.annotation.DrawableRes

/** Duotone icons, split into a soft area and an outline to color apart. */
@Suppress("EnumEntryName")
enum class DuotoneIcon(@DrawableRes val fill: Int, @DrawableRes val line: Int) {
${duotoneEntries.join("\n")}
}
`
)

for (const [source, target] of Object.entries(fonts)) {
  files.set(
    join(android, "res/font", target),
    readFileSync(join(kit, "Resources/Fonts", source))
  )
}

let stale = 0
const same = (path, content) => {
  if (!existsSync(path)) return false
  const current = readFileSync(path)
  return current.equals(Buffer.from(content))
}
for (const [path, content] of files) {
  if (same(path, content)) continue
  if (check) {
    console.error(`out of date: ${path}`)
    stale++
  } else {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, content)
    console.log(`wrote ${path}`)
  }
}
// Drawables of removed icons.
const drawables = join(android, "res/drawable")
for (const file of existsSync(drawables) ? readdirSync(drawables) : []) {
  const path = join(drawables, file)
  if (files.has(path)) continue
  if (check) {
    console.error(`no longer generated: ${path}`)
    stale++
  } else {
    rmSync(path)
    console.log(`removed ${path}`)
  }
}

if (missing.length) {
  console.error(`Icon without SVG or imageset: ${missing.join(", ")}`)
}
if (stale) {
  console.error("Run `pnpm generate`.")
  process.exit(1)
}
