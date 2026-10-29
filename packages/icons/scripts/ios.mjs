// Copies the icons the iOS apps use into DesignKit's asset catalog: every
// raw value of `BrandIcon` ("PhotosFilled") whose SVG is in src/svgs becomes
// a template imageset. Imagesets without an SVG here (hand-made ones like
// GoogleMark) are left alone. `--check` fails instead of writing when an
// imageset is out of date.
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

const enumSource = readFileSync(join(kit, "BrandIcon.swift"), "utf8")
const names = [
  ...new Set([...enumSource.matchAll(/case \w+ = "(\w+)"/g)].map((m) => m[1])),
]

let stale = 0
const missing = []
for (const name of names) {
  const svg = join(root, "src/svgs", `${name}.svg`)
  const set = join(assets, `${name}.imageset`)
  if (!existsSync(svg)) {
    if (!existsSync(set)) missing.push(name)
    continue
  }
  const files = [
    [join(set, `${name}.svg`), readFileSync(svg, "utf8")],
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
  console.error(`BrandIcon without SVG or imageset: ${missing.join(", ")}`)
}
if (stale) {
  console.error("Run `pnpm generate`.")
  process.exit(1)
}
