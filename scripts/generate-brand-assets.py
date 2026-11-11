"""Generate the Smart Shopper app icon, splash marks, and favicon.

Usage: python3 scripts/generate-brand-assets.py  (requires Pillow)
"""

from PIL import Image, ImageDraw, ImageChops, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'images'
OUT.mkdir(parents=True, exist_ok=True)
SS = 4

INK = (11, 15, 13, 255)
LIME = (149, 243, 118, 255)
LIME_LIGHT = (169, 250, 141)
LIME_DARK = (124, 235, 92)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def lime_gradient(size):
    img = Image.new('RGB', (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        c = lerp(LIME_LIGHT, LIME_DARK, y / max(1, size - 1))
        d.line([(0, y), (size, y)], fill=c)
    # Soft highlight in the upper-left so the icon feels lit.
    highlight = Image.new('L', (size, size), 0)
    hd = ImageDraw.Draw(highlight)
    hd.ellipse([-size * 0.28, -size * 0.38, size * 0.72, size * 0.62], fill=70)
    highlight = highlight.filter(ImageFilter.GaussianBlur(size * 0.10))
    white = Image.new('RGB', (size, size), (255, 255, 255))
    return Image.composite(white, img, highlight.point(lambda v: int(v * 0.34)))


def mark_layer(S, color):
    """Monochrome shopping bag with a negative-space check mark."""
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    scale = S / 1024

    def box(coords):
        return [round(v * scale) for v in coords]

    # Handle (drawn first so the bag body hides its lower ends).
    handle_w = max(2, round(64 * scale))
    d.arc(box([384, 176, 640, 436]), 180, 360, fill=color, width=handle_w)
    d.line(box([384, 300, 384, 400]), fill=color, width=handle_w)
    d.line(box([640, 300, 640, 400]), fill=color, width=handle_w)

    # Bag body.
    d.rounded_rectangle(box([276, 346, 748, 812]), radius=round(104 * scale), fill=color)

    # Check mark is cut out of the bag so the background shows through.
    check = Image.new('L', (S, S), 0)
    cd = ImageDraw.Draw(check)
    pts = [tuple(round(v * scale) for v in p) for p in [(392, 584), (484, 676), (648, 506)]]
    w = max(2, round(72 * scale))
    cd.line(pts, fill=255, width=w, joint='curve')
    r = w / 2
    for x, y in pts:
        cd.ellipse([x - r, y - r, x + r, y + r], fill=255)

    alpha = ImageChops.subtract(layer.getchannel('A'), check)
    layer.putalpha(alpha)
    return layer


def rounded_mask(S, radius):
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=255)
    return mask


def app_icon(S=1024):
    big = S * SS
    bg = lime_gradient(big).convert('RGBA')
    # Slightly larger mark than the source canvas keeps the bag confident in the icon.
    layer = mark_layer(big, INK)
    scaled = layer.resize((round(big * 1.32), round(big * 1.32)), Image.LANCZOS)
    # Nudge down slightly so the bag sits on the icon's optical centre.
    y = round((big - scaled.height) / 2 + 38 * (S / 1024) * SS)
    bg.alpha_composite(scaled, (round((big - scaled.width) / 2), y))
    return bg.resize((S, S), Image.LANCZOS)


def favicon(S=512):
    big = S * SS
    bg = lime_gradient(big).convert('RGBA')
    layer = mark_layer(big, INK)
    layer = layer.resize((round(big * 1.22), round(big * 1.22)), Image.LANCZOS)
    y = round((big - layer.height) / 2 + 38 * (S / 1024) * SS)
    bg.alpha_composite(layer, (round((big - layer.width) / 2), y))
    bg.putalpha(rounded_mask(big, round(big * 0.20)))
    return bg.resize((S, S), Image.LANCZOS)


def transparent_mark(S, color, fill=0.94):
    """Trim the mark and add breathing room, for splash / header use."""
    big = S * SS
    layer = mark_layer(big, color)
    bbox = layer.getbbox()
    layer = layer.crop(bbox)
    # Fit the mark into `fill` of the canvas with equal padding.
    target = round(big * fill)
    ratio = min(target / layer.width, target / layer.height)
    layer = layer.resize((round(layer.width * ratio), round(layer.height * ratio)), Image.LANCZOS)
    canvas = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    canvas.alpha_composite(layer, ((big - layer.width) // 2, (big - layer.height) // 2))
    return canvas.resize((S, S), Image.LANCZOS)


def adaptive_mark(S, color):
    """A mark sized for the Android adaptive-icon safe zone."""
    big = S * SS
    layer = mark_layer(big, color)
    layer = layer.crop(layer.getbbox())
    target = round(big * 0.60)
    ratio = target / max(layer.width, layer.height)
    layer = layer.resize((round(layer.width * ratio), round(layer.height * ratio)), Image.LANCZOS)
    canvas = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    canvas.alpha_composite(layer, ((big - layer.width) // 2, (big - layer.height) // 2))
    return canvas.resize((S, S), Image.LANCZOS)


def adaptive_foreground(S=1024):
    return adaptive_mark(S, INK)


def adaptive_background(S=1024):
    big = S * SS
    return lime_gradient(big).convert('RGBA').resize((S, S), Image.LANCZOS)


def glow(S=604):
    big = S * SS
    glow = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse([big * 0.12, big * 0.12, big * 0.88, big * 0.88], fill=(149, 243, 118, 115))
    glow = glow.filter(ImageFilter.GaussianBlur(big * 0.075))
    return glow.resize((S, S), Image.LANCZOS)


assets = {
    OUT / 'icon.png': app_icon(),
    OUT / 'favicon.png': favicon(),
    OUT / 'splash-icon.png': transparent_mark(512, INK),
    OUT / 'splash-icon-light.png': transparent_mark(512, INK),
    OUT / 'splash-icon-dark.png': transparent_mark(512, LIME),
    OUT / 'logo-mark.png': transparent_mark(512, (255, 255, 255, 255)),
    OUT / 'android-icon-foreground.png': adaptive_foreground(),
    OUT / 'android-icon-background.png': adaptive_background(),
    OUT / 'android-icon-monochrome.png': adaptive_mark(432, (255, 255, 255, 255)),
    OUT / 'logo-glow.png': glow(),
}
for path, im in assets.items():
    im.save(path, optimize=True)
    print(path.relative_to(ROOT), im.size, im.mode)

# Keep the legacy favicon locations in sync.
root_fav = ROOT / 'assets' / 'favicon.png'
root_fav.parent.mkdir(exist_ok=True)
favicon(512).save(root_fav, optimize=True)
print(root_fav.relative_to(ROOT), (512, 512))
# Legacy iOS/splash path now points at a proper opaque icon too.
app_icon().save(ROOT / 'assets' / 'fav.png', optimize=True)
print('assets/fav.png', (1024, 1024))
