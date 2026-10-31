// Copies the icons the iOS apps use into DesignKit's asset catalog: every
// raw value of `BrandIcon` ("PhotosFilled") whose SVG is in src/svgs becomes
// a template imageset. Imagesets without an SVG here (hand-made ones like
// GoogleMark) are left alone. Every `DuotoneIcon` ("CartDuotone") becomes
// two imagesets, "CartDuotoneFill" (the 15 % opacity area, made opaque) and
// "CartDuotoneLine" (everything else), so the apps can color them apart.
// `--check` fails instead of writing when an imageset is out of date.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const kit = join(root, "../DesignKit/Sources/DesignKit")
const assets = join(kit, "Resources/Icons.xcassets/Icons")
const check = process.argv.includes("--check")

const contents = (name) =>
  JSON.stringify(
    {
      images: [{ filename: `${name}.svg`, idiom: "universal" }],
      info: { author: "xcode", version: 1 },
      properties: {
        "preserves-vector-representation": true,
        "template-rendering-intent": "template",
      },
    },
    null,
    2
  ).replaceAll('":', '" :') + "\n"

const caseNames = (file) => {
  const source = readFileSync(join(kit, file), "utf8")
  return [
    ...new Set([...source.matchAll(/case \w+ = "(\w+)"/g)].map((m) => m[1])),
  ]
}

/** The duotone's layers: the `opacity` paths and the rest, each opaque. */
function splitDuotone(svg) {
  const [open] = svg.match(/<svg[^>]*>/)
  // Paths with their own opacity, or inside a <g opacity="…"> group (People).
  const fill = []
  const line = []
  const body = svg.replace(/<svg[^>]*>|<\/svg>/g, "")
  for (const [, group, path] of body.matchAll(
    /(<g[^>]*>[\s\S]*?<\/g>)|(<path[^>]*\/>)/g
  )) {
    if (group) {
      const target = /^<g[^>]*\sopacity="/.test(group) ? fill : line
      target.push(...(group.match(/<path[^>]*\/>/g) ?? []))
    } else {
      ;(/\sopacity="/.test(path) ? fill : line).push(path)
    }
  }
  const layer = (paths) =>
    [
      open,
      ...paths.map((p) => p.replace(/\sopacity="[^"]*"/, "")),
      "</svg>",
      "",
    ].join("\n")
  return { Fill: layer(fill), Line: layer(line) }
}

const sets = []
const missing = []
for (const name of caseNames("BrandIcon.swift")) {
  const svg = join(root, "src/svgs", `${name}.svg`)
  if (existsSync(svg)) sets.push([name, readFileSync(svg, "utf8")])
  else if (!existsSync(join(assets, `${name}.imageset`))) missing.push(name)
}
for (const name of caseNames("DuotoneIcon.swift")) {
  const svg = join(root, "src/svgs", `${name}.svg`)
  if (!existsSync(svg)) {
    missing.push(name)
    continue
  }
  for (const [layer, content] of Object.entries(
    splitDuotone(readFileSync(svg, "utf8"))
  ))
    sets.push([`${name}${layer}`, content])
}

let stale = 0
for (const [name, svg] of sets) {
  const set = join(assets, `${name}.imageset`)
  const files = [
    [join(set, `${name}.svg`), svg],
    [join(set, "Contents.json"), contents(name)],
  ]
  for (const [path, content] of files) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : null
    if (current === content) continue
    if (check) {
      console.error(`out of date: ${path}`)
      stale++
    } else {
      mkdirSync(set, { recursive: true })
      writeFileSync(path, content)
      console.log(`wrote ${path}`)
    }
  }
}

if (missing.length) {
  console.error(`Icon without SVG or imageset: ${missing.join(", ")}`)
}
if (stale) {
  console.error("Run `pnpm generate`.")
  process.exit(1)
}
