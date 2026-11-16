# Jesús Jódar · Portfolio

React, Vite, CSS propio y Roboto Flex variable. Paper Shaders dibuja el fondo y las transiciones Bayer; no se usa OGL.

## Desarrollo y validación

- `npm ci`: instalar las dependencias del lockfile.
- `npm run dev`: servidor de desarrollo. Para acceder desde la red local: `npm run dev -- --host 0.0.0.0`.
- `npm run dev:views`: comparación desktop 1920×1080 y mobile 420×912. Mantiene el tamaño interno de cada iframe; no emula Safari ni el hardware de un iPhone.
- `npm run dev:dither`: laboratorio local de GLSL Dither, Lygia y Paper. Sus dependencias y fuentes de evaluación no se incluyen en la compilación del portfolio.
- `npm run lint`: comprobar JavaScript y JSX.
- `npm run build`: generar la actividad de GitHub y compilar a `dist/`.
- `npm run preview`: servir la compilación local.

Los pushes a `main` se publican con GitHub Pages. El workflow también actualiza la actividad diariamente.

## Organización

- `src/main.jsx`: composición de la página y ajuste de Safari bajo la Dynamic Island.
- `src/components/`: presentación, fondo y navegación.
- `src/styles/layout.css`, `footer.css`: estilos de cada superficie. `src/index.css` mantiene su orden de carga.
- `src/tokens.css`: ejes tipográficos elegidos para la web.
- `src/data/portfolio-sections.js`: textos de las secciones.
- `src/data/profile.json`, `social-icons.json`: identidad, foto y enlaces sociales.
- `src/graphics/`: shaders del fondo y las transiciones.
- `src/lib/`: medición tipográfica, calendario y utilidades de la página.
- `dev/`: previsualización responsive y laboratorio de efectos.

## Scroll

`ScrollBackground` calcula el recorrido de las secciones, el tono del fondo y las transiciones de navegación. El footer permanece fijo y no se despliega al terminar la última sección.

## Actividad de GitHub

`scripts/generate-activity.js` consulta el calendario público de `jesusjodar` sin tokens y genera `src/data/github-activity.json`, ignorado por Git. Se ejecuta antes de iniciar y compilar. El periodo de 365 días termina en el día actual de Europe/Madrid. El mosaico muestra los días más recientes que caben en dos filas, con celdas blancas de opacidad variable y sin enlaces.

Si falla la red, se conserva el último resultado válido indicando su periodo. Sin datos válidos, la generación falla en lugar de inventar actividad. El navegador usa la instantánea de la compilación, no consulta GitHub.

## Recursos

`public/side-artwork.svg` contiene el dibujo utilizado en las dos mitades laterales. Los SVG de fondo conservan una alternativa estática si WebGL no está disponible. Las fuentes de los iconos están documentadas en `docs/icon-sources.md`; las del laboratorio en `dev/dither/vendor/README.md`.
