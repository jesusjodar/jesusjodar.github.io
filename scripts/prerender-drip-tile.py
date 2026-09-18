#!/usr/bin/env python3
"""Pre-renderiza las ondas pixeladas del fondo inferior
(public/drip-tile.png).

Lienzo único y ancho (se pinta centrado y sin repetir): columnas negras
de bloques cuadrados que nacen del borde inferior, pronunciadas en los
extremos laterales y suaves hacia el centro (envolvente sobre la
amplitud). Espejo del derretido de la foto (scripts/prerender-pfp.py)
pero hacia arriba.

Uso:
    python3 scripts/prerender-drip-tile.py [salida]
"""

import math
import sys

from PIL import Image

BLOCK = 10
COLS = 384
ROWS = 16
W = COLS * BLOCK
H = ROWS * BLOCK


def _hash01(n):
    return (math.sin(n * 12.9898) * 43758.5453) % 1.0


def col_blocks(bx):
    # Envolvente: 0 en el centro, satura a 1 antes del borde del lienzo
    # para que el efecto completo se vea en pantallas comunes.
    u = (bx - (COLS - 1) / 2) / ((COLS - 1) / 2)
    env = min(1.0, abs(u) * 1.6)
    amp = 1 + 5 * env
    wave = 0.6 * math.sin(bx * 2 * math.pi * 9 / COLS + 1)
    wave += 0.3 * math.sin(bx * 2 * math.pi * 23 / COLS + 0.5)
    wave += 0.15 * math.sin(bx * 2 * math.pi * 47 / COLS + 2)
    jit = (_hash01(bx) - 0.5) * 2 * (0.3 + 0.7 * env)
    return min(ROWS, max(4, math.floor(11 + amp * wave + jit + 0.5)))


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'public/drip-tile.png'
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = img.load()
    heights = []
    for bx in range(COLS):
        h = col_blocks(bx)
        heights.append(h)
        for y in range(H - h * BLOCK, H):
            for x in range(bx * BLOCK, (bx + 1) * BLOCK):
                px[x, y] = (0, 0, 0, 255)
    img.save(out, optimize=True)
    print(f'OK -> {out} ({W}x{H})')
    print('cols: ' + ''.join(f'{h:02d}' for h in heights))


if __name__ == '__main__':
    main()
