#!/usr/bin/env python3
"""Pre-renderiza el efecto dithering del avatar del CV (public/pfp-dither.png).

Replica 1:1 la tubería canvas que antes corría en runtime en CvContent.jsx
(redimensionado + recorte + dithering Bayer ordenado), pero offline desde la
foto original, para que el runtime solo muestre el PNG resultante.

Uso:
    python3 scripts/prerender-pfp.py <foto-original> [salida]

La foto original (1536x2048) vive en el historial de git:
    git show HEAD~1:public/pfp.jpg > /tmp/pfp-original.jpg
(y había una copia de seguridad en /tmp/pfp-original.jpg).
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


def js_round(x):
    # Math.round de JS: floor(x + 0.5) (el round() de Python es banker's).
    return math.floor(x + 0.5)


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

    # El dithering deja exactamente 6 tonos: PNG-8 con esa paleta es
    # lossless y mínimo.
    out_img = canvas.convert('L').quantize(colors=LEVELS, method=Image.FASTOCTREE)
    out_img.save(out, optimize=True)
    print(f'OK -> {out} ({out_img.size[0]}x{out_img.size[1]})')


if __name__ == '__main__':
    main()
