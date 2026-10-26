// Generates the React icon components from src/svgs. svgr writes into a
// temporary folder; only changed files are copied over and stale ones
// removed, so the output folder never disappears under a running dev server.
import { execFileSync } from "node:child_process"
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const targets = [
  { out: "src/generated", args: [] },
]

for (const { out, args } of targets) {
  const tmp = mkdtempSync(join(tmpdir(), "icons-"))
  execFileSync(
    "svgr",
    [...args, "--no-prettier", "--silent", "--out-dir", tmp, "src/svgs"],
    {
      stdio: "inherit",
    }
  )
  mkdirSync(out, { recursive: true })
  const fresh = new Set(readdirSync(tmp))
  let changed = 0
  for (const name of fresh) {
    const content = readFileSync(join(tmp, name))
    const target = join(out, name)
    if (!existsSync(target) || !readFileSync(target).equals(content)) {
      writeFileSync(target, content)
      changed++
    }
  }
  for (const name of readdirSync(out)) {
    if (!fresh.has(name)) {
      rmSync(join(out, name))
      changed++
    }
  }
  rmSync(tmp, { recursive: true, force: true })
  console.log(`${out}: ${fresh.size} Dateien, ${changed} geändert`)
}
