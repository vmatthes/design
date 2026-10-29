// Writes the tokens from src/tokens.ts as CSS (tokens.css) and Swift
// (packages/DesignKit). `--check` fails instead of writing when a generated
// file is out of date, for CI.
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { ACCENT_COLORS, COLORS, CSS_VALUES } from "../src/tokens.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const check = process.argv.includes("--check")

const cssHeader = `/*
 * Generated from packages/design/src/tokens.ts – do not edit.
 * \`.light\` re-applies the light tokens to a subtree that stays light in
 * dark mode; dark tokens apply under \`.dark\` (next-themes).
 */
`

function comment(text: string | undefined, indent: string) {
  return text ? `${indent}/* ${text} */\n` : ""
}

function css() {
  const colors = COLORS.filter((t) => !t.platforms || t.platforms.includes("css"))
  const block = (theme: "light" | "dark") => {
    let out = `  color-scheme: ${theme};\n`
    for (const t of colors) {
      out += comment(t.comment, "  ") + `  --${t.name}: ${t[theme]};\n`
    }
    for (const v of CSS_VALUES) {
      const value = theme === "dark" ? v.dark : v.light
      if (value) out += comment(theme === "light" ? v.comment : undefined, "  ") + `  --${v.name}: ${value};\n`
    }
    return out
  }
  let themeMap = ""
  for (const t of colors) {
    if (t.tailwind !== false) themeMap += `  --color-${t.name}: var(--${t.name});\n`
  }
  for (const v of CSS_VALUES) {
    if (v.tailwind) themeMap += `  --${v.name}: var(--${v.name});\n`
  }
  return `${cssHeader}
:root,
.light {
${block("light")}}

.dark {
${block("dark")}}

@theme inline {
${themeMap}}
`
}

const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
const hex = (value: string) => "0x" + value.replace("#", "").toUpperCase()

function swiftTokens() {
  let out = `// Generated from packages/design/src/tokens.ts – do not edit.
import SwiftUI

/// Design tokens, the same values as the CSS variables of the web apps.
/// Each color follows the light or dark appearance.
public enum Tokens {
`
  for (const t of COLORS) {
    if (t.platforms && !t.platforms.includes("swift")) continue
    if (t.comment) out += `  /// ${t.comment}\n`
    out += `  public static let ${camel(t.name)} = dynamic(${hex(t.light)}, ${hex(t.dark)})\n`
  }
  return out + "}\n"
}

function swiftAccents() {
  const rows = ACCENT_COLORS.map((a) => `    (value: "${a.value}", name: "${a.name}"),`).join("\n")
  return `// Generated from packages/design/src/tokens.ts – do not edit.

/// Accent colors of the brand palette: collection colors in letmeshowyou,
/// member colors in Rudel. Text on them is always \`Tokens.onAccent\`.
public enum Accents {
  public static let all: [(value: String, name: String)] = [
${rows}
  ]
}
`
}

const outputs: [string, string][] = [
  [join(root, "tokens.css"), css()],
  [join(root, "../DesignKit/Sources/DesignKit/Tokens.generated.swift"), swiftTokens()],
  [join(root, "../DesignKit/Sources/DesignKit/Accents.generated.swift"), swiftAccents()],
]

let stale = 0
for (const [path, content] of outputs) {
  let current = ""
  try {
    current = readFileSync(path, "utf8")
  } catch {}
  if (current === content) continue
  if (check) {
    console.error(`out of date: ${path}`)
    stale++
  } else {
    writeFileSync(path, content)
    console.log(`wrote ${path}`)
  }
}
if (stale) {
  console.error("Run `pnpm --filter @volkermatthes/design generate`.")
  process.exit(1)
}
