#!/usr/bin/env python3
"""Pre-renderiza el avatar del CV (public/pfp-dither.png).

Replica 1:1 la tubería canvas que antes corría en runtime en CvContent.jsx
(redimensionado + recorte + dithering Bayer ordenado), pero offline desde la
foto original, para que el runtime solo muestre el PNG resultante.

Además hornea lo que antes hacían capas CSS en runtime:
- Tinte neón: replica exacto `mix-blend-mode: color` con --color-neon
  (#2aff75) sobre el gris ditherizado (fusión `color` de CSS Compositing).
- Derretido pixelado del borde inferior: gotas en bloques de MELT_BLOCK px
  con longitudes deterministas (seno + hash), estirando la foto ×3 hacia
  abajo; donde no hay gota el píxel queda transparente.

Uso:
    python3 scripts/prerender-pfp.py <foto-original> [salida]

La foto original (1536x2048) vive en el historial de git:
    git show 2a45e41~1:public/pfp.jpg > /tmp/pfp-original.jpg
"""

import io
import math
import sys

from PIL import Image, ImageCms

# Constantes idénticas al pipeline de canvas que sustituyen.
S = 220
CROP_OVERFLOW = 1.17
CROP_BIAS = 0.1
LEVELS = 6
SPREAD = 52
CONTRAST = 1.20
EXPOSURE = 12
GAMMA = 0.92

BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
]

# Tinte neón: var(--color-neon).
NEON = (0x2A / 255, 0xFF / 255, 0x75 / 255)

# Derretido inferior: bloques cuadrados de este lado; la zona de
# derretido ocupa MELT_H px y las gotas estiran la foto ×3 hacia abajo.
MELT_BLOCK = 5
MELT_H = 45
MELT_TOP = S - MELT_H
MELT_STRETCH = 3


def js_round(x):
    # Math.round de JS: floor(x + 0.5) (el round() de Python es banker's).
    return math.floor(x + 0.5)


def _lum(c):
    return 0.30 * c[0] + 0.59 * c[1] + 0.11 * c[2]


def _clip_color(c):
    r, g, b = c
    l = _lum((r, g, b))
    n = min(r, g, b)
    x = max(r, g, b)
    if n < 0:
        r = l + ((r - l) * l) / (l - n)
        g = l + ((g - l) * l) / (l - n)
        b = l + ((b - l) * l) / (l - n)
    if x > 1:
        r = l + ((r - l) * (1 - l)) / (x - l)
        g = l + ((g - l) * (1 - l)) / (x - l)
        b = l + ((b - l) * (1 - l)) / (x - l)
    return (r, g, b)


def _set_lum(c, lum):
    d = lum - _lum(c)
    return _clip_color((c[0] + d, c[1] + d, c[2] + d))


def blend_color(backdrop_gray):
    # mix-blend-mode: color — tono/saturación de la fuente (neón) y
    # luminosidad del fondo (gris ditherizado). Ambas capas opacas.
    return _set_lum(NEON, backdrop_gray)


def _hash01(n):
    return (math.sin(n * 12.9898) * 43758.5453) % 1.0


def drip_blocks(bx):
    # Longitud de la gota en bloques (mínimo 2: los recortes nunca son muy
    # largos y las gotas largas sobresalen hasta abajo): onda para
    # agruparlas de forma orgánica + jitter determinista por columna.
    base = 6 + 2.5 * math.sin(bx * 0.55 + 0.8)
    jit = (_hash01(bx) - 0.5) * 4
    return min(MELT_H // MELT_BLOCK, max(2, js_round(base + jit)))


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'pfp-original.jpg'
    out = sys.argv[2] if len(sys.argv) > 2 else 'public/pfp-dither.png'

    img = Image.open(src)

    # El canvas del navegador pinta en sRGB; si la foto trae perfil ICC
    # (iPhone suele usar Display P3) hay que convertir antes, o el gris
    # del dithering sale distinto al que veía el navegador.
    icc = img.info.get('icc_profile')
    if icc:
        src_profile = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        srgb = ImageCms.createProfile('sRGB')
        img = ImageCms.profileToProfile(img, src_profile, srgb)
    img = img.convert('RGB')

    nw, nh = img.size
    scale = max(S / nw, S / nh) * CROP_OVERFLOW
    dw, dh = round(nw * scale), round(nh * scale)
    # BOX = promedio de área, equivalente al mipmapping+bilinear del
    # navegador al reducir 6x; preserva el promediado del que depende el
    # patrón del dithering.
    resized = img.resize((dw, dh), Image.BOX)

    ox = js_round((S - dw) * CROP_BIAS)
    oy = js_round((S - dh) * CROP_BIAS)
    canvas = Image.new('RGB', (S, S), (0, 0, 0))
    canvas.paste(resized, (ox, oy))

    gamma_lut = [round(math.pow(i / 255, GAMMA) * 255) for i in range(256)]
    px = canvas.load()
    for y in range(S):
        brow = BAYER[y % 4]
        for x in range(S):
            r, g, b = px[x, y]
            gray = r * 0.299 + g * 0.587 + b * 0.114
            graded = (gray - 128) * CONTRAST + 128 + EXPOSURE
            clamped = min(255.0, max(0.0, graded))
            lifted = gamma_lut[int(clamped)]
            t = (brow[x % 4] / 16 - 0.5) * SPREAD
            q = js_round(((lifted + t) / 255) * (LEVELS - 1)) / (LEVELS - 1)
            v = min(255, max(0, js_round(q * 255)))
            px[x, y] = (v, v, v)

    # Tinte neón horneado: los 6 tonos del dithering pasan por la misma
    # fusión `color` que aplicaba la capa CSS con mix-blend-color.
    gray_levels = [k * 255 // (LEVELS - 1) for k in range(LEVELS)]
    neon_pal = []
    for v in gray_levels:
        r, g, b = blend_color(v / 255)
        neon_pal.append((
            min(255, max(0, js_round(r * 255))),
            min(255, max(0, js_round(g * 255))),
            min(255, max(0, js_round(b * 255))),
        ))

    tinted = Image.new('RGB', (S, S))
    tpx = tinted.load()
    for y in range(S):
        for x in range(S):
            tpx[x, y] = neon_pal[px[x, y][0] * (LEVELS - 1) // 255]

    # Derretido pixelado del borde inferior con transparencia: las gotas
    # estiran la foto hacia abajo, los huecos quedan transparentes.
    out_img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    opx = out_img.load()
    for y in range(MELT_TOP):
        for x in range(S):
            opx[x, y] = tpx[x, y] + (255,)
    drips = []
    for bx in range(S // MELT_BLOCK):
        d = drip_blocks(bx)
        drips.append(d)
        for y in range(MELT_TOP, MELT_TOP + d * MELT_BLOCK):
            sy = MELT_TOP + (y - MELT_TOP) // MELT_STRETCH
            for x in range(bx * MELT_BLOCK, (bx + 1) * MELT_BLOCK):
                opx[x, y] = tpx[x, sy] + (255,)

    out_img.save(out, optimize=True)
    print(f'OK -> {out} ({out_img.size[0]}x{out_img.size[1]})')
    print('drips: ' + ''.join(str(d) for d in drips))


if __name__ == '__main__':
    main()
