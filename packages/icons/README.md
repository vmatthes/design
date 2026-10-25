# @volkermatthes/icons

SVG-Icons als React-Komponenten. Jedes Icon gibt es in drei Varianten: `Name`, `NameDuotone`, `NameFilled`.

## Nutzung

```tsx
import { Settings, ArchiveDuotone } from "@volkermatthes/icons"

<Settings />                                  // 16px, currentColor
<Settings size={24} className="text-muted" />
<ArchiveDuotone width={20} color="#e11d48" aria-label="Archiv" />
```

| Prop | Default | Beschreibung |
| --- | --- | --- |
| `size` | `16` | Setzt Breite und Höhe |
| `width` / `height` | `size` | Einzeln überschreibbar |
| `color` | `currentColor` | Füllfarbe |

Alle übrigen SVG-Props (`className`, `style`, `aria-*`, Events …) werden an das `<svg>` durchgereicht.

## Neue Icons

1. SVG (24×24, Farbe `black`) nach `src/svgs/` legen, Dateiname in PascalCase.
2. `npm run build --workspace=@volkermatthes/icons`

`src/generated/` wird von svgr erzeugt und ist nicht eingecheckt.
