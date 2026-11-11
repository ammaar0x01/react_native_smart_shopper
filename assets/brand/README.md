# Smart Shopper brand assets

The mark is a shopping bag with a check cut out of it. The cut-out is intentional:
the check picks up the colour of whatever surface the mark sits on.

## Palette

| Name | Hex | Use |
| --- | --- | --- |
| Lime | `#95F376` | Primary brand colour, icon background, splash background |
| Lime light | `#A9FA8D` | Top of icon gradient |
| Lime dark | `#7CEB5C` | Bottom of icon gradient |
| Ink | `#0B0F0D` | Logo mark, text, dark splash background |

## Source files

- `logo.svg` — square app icon source.
- `favicon.svg` — rounded favicon source.
- `logo-mark.svg` — transparent, single-colour mark for use on any surface.

## Generated files

| File | Size | Purpose |
| --- | --- | --- |
| `assets/images/icon.png` | 1024×1024 | iOS / fallback app icon |
| `assets/images/android-icon-background.png` | 1024×1024 | Android adaptive icon background |
| `assets/images/android-icon-foreground.png` | 1024×1024 | Android adaptive icon foreground |
| `assets/images/android-icon-monochrome.png` | 432×432 | Android themed icon |
| `assets/images/splash-icon-light.png` | 512×512 | Light-mode splash mark |
| `assets/images/splash-icon-dark.png` | 512×512 | Dark-mode splash mark |
| `assets/images/logo-mark.png` | 512×512 | Tintable in-app mark |
| `assets/images/logo-glow.png` | 604×604 | Lime glow used by the splash animation |
| `assets/favicon.png` | 512×512 | Web favicon |

Regenerate every PNG from the repo root with:

```bash
python3 scripts/generate-brand-assets.py
```

The script requires [Pillow](https://python-pillow.org/). The SVGs in this folder are
the editable vector masters; the script keeps the exact icon, splash, glow, Android,
and favicon exports in sync.
