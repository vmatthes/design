// Writes the sticker motifs of src/stickers for both platforms: their markup
// for the web (src/stickers.generated.ts) and flattened layers for DesignKit
// (Stickers.generated.swift). `--check` fails when a file is out of date.
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const svgs = join(root, "src/stickers")
const web = join(root, "src/stickers.generated.ts")
const swift = join(
  root,
  "../DesignKit/Sources/DesignKit/Stickers.generated.swift"
)
const check = process.argv.includes("--check")

const paints = { "var(--c)": "c", "#FFFFFF": "w", "#1A1A1A": "i", "#4A4A46": "d" }

const round = (n) => String(Math.round(n * 100) / 100)

/** A rotation as a matrix [a, b, c, d, e, f]. */
const rotation = (transform) => {
  if (!transform) return null
  const m = transform.match(/^rotate\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)$/)
  if (!m) throw new Error(`Unsupported transform: ${transform}`)
  const [angle, cx, cy] = m.slice(1).map(Number)
  const r = (angle * Math.PI) / 180
  const [cos, sin] = [Math.cos(r), Math.sin(r)]
  return [cos, sin, -sin, cos, cx - cos * cx + sin * cy, cy - sin * cx - cos * cy]
}

const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
]

const IDENTITY = [1, 0, 0, 1, 0, 0]

/** An SVG arc as cubic segments, each [x1, y1, x2, y2, x, y]. */
function arcToCubics(x0, y0, rx, ry, rotationDeg, large, sweep, x, y) {
  if (rx === 0 || ry === 0) return [[x0, y0, x, y, x, y]]
  const phi = (rotationDeg * Math.PI) / 180
  const [cos, sin] = [Math.cos(phi), Math.sin(phi)]
  const dx = (x0 - x) / 2
  const dy = (y0 - y) / 2
  const px = cos * dx + sin * dy
  const py = -sin * dx + cos * dy
  const lambda = (px * px) / (rx * rx) + (py * py) / (ry * ry)
  if (lambda > 1) {
    rx *= Math.sqrt(lambda)
    ry *= Math.sqrt(lambda)
  }
  const numerator =
    rx * rx * ry * ry - rx * rx * py * py - ry * ry * px * px
  const denominator = rx * rx * py * py + ry * ry * px * px
  const factor =
    (large === sweep ? -1 : 1) *
    Math.sqrt(Math.max(0, numerator / denominator))
  const cxp = (factor * rx * py) / ry
  const cyp = (-factor * ry * px) / rx
  const cx = cos * cxp - sin * cyp + (x0 + x) / 2
  const cy = sin * cxp + cos * cyp + (y0 + y) / 2
  const start = Math.atan2((py - cyp) / ry, (px - cxp) / rx)
  let delta = Math.atan2((-py - cyp) / ry, (-px - cxp) / rx) - start
  if (sweep && delta < 0) delta += 2 * Math.PI
  if (!sweep && delta > 0) delta -= 2 * Math.PI
  const count = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2) - 1e-9))
  const step = delta / count
  const k = (4 / 3) * Math.tan(step / 4)
  const point = (ux, uy) => [
    cos * rx * ux - sin * ry * uy + cx,
    sin * rx * ux + cos * ry * uy + cy,
  ]
  const cubics = []
  for (let i = 0; i < count; i++) {
    const a = start + i * step
    const b = a + step
    const [c1x, c1y] = point(
      Math.cos(a) - k * Math.sin(a),
      Math.sin(a) + k * Math.cos(a)
    )
    const [c2x, c2y] = point(
      Math.cos(b) + k * Math.sin(b),
      Math.sin(b) - k * Math.cos(b)
    )
    const [ex, ey] = i === count - 1 ? [x, y] : point(Math.cos(b), Math.sin(b))
    cubics.push([c1x, c1y, c2x, c2y, ex, ey])
  }
  return cubics
}

/** Path data as absolute M, L, Q, C and Z commands. */
function normalizePath(d) {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+)(?:e-?\d+)?/g) ?? []
  const out = []
  let i = 0
  let command = ""
  let [x, y, startX, startY] = [0, 0, 0, 0]
  let [controlX, controlY] = [null, null]
  const number = () => Number(tokens[i++])
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) command = tokens[i++]
    const relative = command === command.toLowerCase()
    const [ox, oy] = relative ? [x, y] : [0, 0]
    switch (command.toUpperCase()) {
      case "M":
        x = ox + number()
        y = oy + number()
        startX = x
        startY = y
        out.push(["M", x, y])
        command = relative ? "l" : "L"
        controlX = null
        break
      case "L":
        x = ox + number()
        y = oy + number()
        out.push(["L", x, y])
        controlX = null
        break
      case "H":
        x = ox + number()
        out.push(["L", x, y])
        controlX = null
        break
      case "V":
        y = oy + number()
        out.push(["L", x, y])
        controlX = null
        break
      case "C": {
        const values = [number(), number(), number(), number(), number(), number()]
        const [x1, y1, x2, y2, ex, ey] = values.map((v, n) =>
          n % 2 ? oy + v : ox + v
        )
        out.push(["C", x1, y1, x2, y2, ex, ey])
        x = ex
        y = ey
        controlX = null
        break
      }
      case "Q": {
        const [cx, cy, ex, ey] = [ox + number(), oy + number(), ox + number(), oy + number()]
        out.push(["Q", cx, cy, ex, ey])
        controlX = cx
        controlY = cy
        x = ex
        y = ey
        break
      }
      case "T": {
        const cx = controlX === null ? x : 2 * x - controlX
        const cy = controlX === null ? y : 2 * y - controlY
        const [ex, ey] = [ox + number(), oy + number()]
        out.push(["Q", cx, cy, ex, ey])
        controlX = cx
        controlY = cy
        x = ex
        y = ey
        break
      }
      case "A": {
        const [rx, ry, rotate, large, sweep] = [number(), number(), number(), number(), number()]
        const [ex, ey] = [ox + number(), oy + number()]
        for (const cubic of arcToCubics(x, y, rx, ry, rotate, large, sweep, ex, ey)) {
          out.push(["C", ...cubic])
        }
        x = ex
        y = ey
        controlX = null
        break
      }
      case "Z":
        out.push(["Z"])
        x = startX
        y = startY
        controlX = null
        command = ""
        break
      default:
        throw new Error(`Unsupported path command: ${command} in ${d}`)
    }
  }
  return out
}

const ellipsePath = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx} ${cy} Z`

function rectPath(x, y, w, h, r) {
  if (!r) return `M${x} ${y} H${x + w} V${y + h} H${x} Z`
  return (
    `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} ` +
    `V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} ` +
    `H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} ` +
    `V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`
  )
}

function shapePath(tag, read) {
  const n = (name, fallback = 0) => {
    const value = read(name)
    return value === undefined ? fallback : Number(value)
  }
  if (tag === "path") return read("d")
  if (tag === "circle") return ellipsePath(n("cx"), n("cy"), n("r"), n("r"))
  if (tag === "ellipse") return ellipsePath(n("cx"), n("cy"), n("rx"), n("ry"))
  if (tag === "rect") {
    const r = Math.min(n("rx", n("ry")), n("width") / 2, n("height") / 2)
    return rectPath(n("x"), n("y"), n("width"), n("height"), r)
  }
  throw new Error(`Unsupported element: ${tag}`)
}

function transformed(commands, m) {
  const pt = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]
  return commands
    .map(([command, ...values]) => {
      const points = []
      for (let i = 0; i < values.length; i += 2) {
        points.push(...pt(values[i], values[i + 1]).map(round))
      }
      return [command, ...points].join(" ")
    })
    .join(" ")
}

/** One line per drawn element: fill|stroke|width|dash|path. */
function layers(svg, name) {
  const stack = [IDENTITY]
  const lines = []
  for (const match of svg.matchAll(/<(\/?)(\w+)((?:\s[^<>]*?)?)(\/?)>/g)) {
    const [, closing, tag, attributes, selfClosing] = match
    if (tag === "svg") continue
    if (tag === "g") {
      if (closing) {
        stack.pop()
      } else {
        const r = rotation(attributes.match(/\stransform="([^"]*)"/)?.[1])
        stack.push(r ? multiply(stack.at(-1), r) : stack.at(-1))
      }
      continue
    }
    if (closing) continue
    if (!selfClosing) throw new Error(`${name}: <${tag}> is not self-closing`)
    const read = (attribute) =>
      attributes.match(new RegExp(`\\s${attribute}="([^"]*)"`))?.[1]
    const own = rotation(read("transform"))
    const matrix = own ? multiply(stack.at(-1), own) : stack.at(-1)
    const paint = (value) => {
      if (value === undefined || value === "none") return "n"
      const role = paints[value]
      if (!role) throw new Error(`${name}: unknown paint ${value}`)
      return role
    }
    // SVG's default fill is black, and the motifs rely on none being explicit.
    const fill = read("fill") === undefined ? "i" : paint(read("fill"))
    const stroke = paint(read("stroke"))
    const width = read("stroke-width") ?? "0"
    const dash = (read("stroke-dasharray") ?? "").trim()
    const path = transformed(normalizePath(shapePath(tag, read)), matrix)
    lines.push([fill, stroke, width, dash, path].join("|"))
  }
  return lines.join("\n")
}

const names = readdirSync(svgs)
  .filter((file) => file.endsWith(".svg"))
  .map((file) => file.slice(0, -4))
  .sort()

const inner = (svg) =>
  svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim()

const sources = Object.fromEntries(
  names.map((name) => [name, readFileSync(join(svgs, `${name}.svg`), "utf8")])
)

const webSource = `// Generated by scripts/stickers.mjs from src/stickers. Do not edit.
export const STICKER_MARKUP = {
${names.map((name) => `  ${name}: ${JSON.stringify(inner(sources[name]))},`).join("\n")}
} as const

export type StickerId = keyof typeof STICKER_MARKUP
`

const swiftSource = `// Generated by packages/icons/scripts/stickers.mjs from
// packages/icons/src/stickers. Do not edit.

public enum Sticker: String, CaseIterable, Sendable {
${names.map((name) => `  case ${name}`).join("\n")}

  /// One line per drawn element: fill|stroke|width|dash|path.
  var source: String {
    switch self {
${names
  .map(
    (name) =>
      `    case .${name}:\n      return """\n${layers(sources[name], name)
        .split("\n")
        .map((line) => `        ${line}`)
        .join("\n")}\n        """`
  )
  .join("\n")}
    }
  }
}
`

const outdated = []
for (const [path, content] of [
  [web, webSource],
  [swift, swiftSource],
]) {
  let current = null
  try {
    current = readFileSync(path, "utf8")
  } catch {}
  if (current === content) continue
  if (check) outdated.push(path)
  else writeFileSync(path, content)
}
if (outdated.length) {
  console.error(`Out of date, run pnpm generate:\n${outdated.join("\n")}`)
  process.exit(1)
}
