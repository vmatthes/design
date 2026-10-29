# design

Gemeinsames Design von letmeshowyou und Rudel (beide in eigenen Repos): `packages/design` (Tokens, npm `@volkermatthes/design`), `packages/icons` (npm `@volkermatthes/icons`), `packages/DesignKit` (Swift Package, `Package.swift` im Wurzelverzeichnis). Details in README.md.

- **Eine Quelle:** Farben und Akzente nur in `packages/design/src/tokens.ts`; `pnpm generate` erzeugt daraus `tokens.css` und die Swift-Dateien `*.generated.swift`, dazu die Icon-Imagesets aus `packages/icons/src/svgs`. Generierte Dateien nie von Hand ändern; `pnpm check` muss grün sein.
- **Beide Apps nutzen alles hier:** Änderungen sind Änderungen an letmeshowyou und Rudel. Namen von Tokens, Icons und `BrandIcon`-Fällen nicht umbenennen oder entfernen, ohne die Apps mitzuziehen; im Zweifel neue Namen ergänzen.
- **Versionen:** npm-Pakete und Swift-Tag haben dieselbe Version (siehe README, „Veröffentlichen“). Veröffentlichen und Pushen nur nach Rückfrage.
- **Texte auf Deutsch** in Dokumentation; Code-Kommentare auf Englisch.
