# design

Gemeinsames Design von **letmeshowyou** und **Rudel**: Farben, Schriften, Icons. Eine Quelle für Web und iPhone (später Android).

| Teil                                        | Für                                                                      | Bezug                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `packages/design` → `@volkermatthes/design` | Web: Tokens als TypeScript (`ACCENT_COLORS`), `tokens.css`, `base.css`   | npm                                                               |
| `packages/icons` → `@volkermatthes/icons`   | Web: Icons als React-Komponenten (`Name`, `NameDuotone`, `NameFilled`)   | npm                                                               |
| `packages/DesignKit` → `DesignKit`          | iOS: `Tokens`, Schriften (`.app()`, `.display()`), Schatten, `BrandIcon` | Swift Package (dieses Repo, `Package.swift` im Wurzelverzeichnis) |

## Einrichten

```bash
pnpm install
pnpm build
```

## Tokens ändern

Farben und Akzentpalette stehen nur in `packages/design/src/tokens.ts`. Danach:

```bash
pnpm generate   # tokens.css, Tokens.generated.swift, Accents.generated.swift, Icon-Imagesets
pnpm check      # schlägt fehl, wenn generierte Dateien veraltet sind (läuft auch in CI)
```

## Neues Icon

1. SVG nach `packages/icons/src/svgs/` legen (`Name.svg`, `NameDuotone.svg`, `NameFilled.svg`).
2. Für iOS einen Fall in `packages/DesignKit/Sources/DesignKit/BrandIcon.swift` ergänzen (`case name = "NameFilled"`).
3. `pnpm generate`: legt das Imageset in `Resources/Icons.xcassets/Icons` an. Imagesets ohne SVG hier (z. B. `GoogleMark`) bleiben unberührt.

## Neuer Sticker

Motive für Collections liegen in `packages/icons/src/stickers/<id>.svg`: Kontur `#1A1A1A`, Details `#FFFFFF`, Fläche `var(--c)`, `viewBox="-4 -4 72 72"`. `pnpm generate` schreibt daraus `STICKER_MARKUP` (Web, `Sticker`) und `Stickers.generated.swift` (iOS, `StickerImage`).

## Veröffentlichen

npm-Pakete und Swift Package haben dieselbe Version.

1. Version in `packages/design/package.json` und `packages/icons/package.json` erhöhen.
2. `pnpm check && pnpm build`, committen.
3. Tag setzen und pushen: `git tag 0.2.0 && git push --tags` (Swift Package Manager nutzt den Tag).
4. `pnpm -r publish --access public` (npm-Konto `volkermatthes`).
5. In letmeshowyou und Rudel die Versionen anheben (`package.json`, `project.yml` der iOS-Apps).

## Lokal in den Apps ausprobieren

- **Web:** im App-Repo `pnpm link ../design/packages/icons` (bzw. `packages/design`), danach `pnpm install` setzt es zurück.
- **iOS:** in Xcode den Ordner dieses Repos in das Projekt ziehen; ein lokales Paket ersetzt die veröffentlichte Version, solange es dort liegt.
