# Jesús Jódar

Página mínima con fondo de ruido orgánico verde y amarillo neón, y pie negro puro (`#000000`) con firma y año.

React + Vite, con CSS propio y fuente Anton.

- `npm ci`: instalar las dependencias del archivo de bloqueo.
- `npm run dev`: iniciar el servidor de desarrollo.
- `npm run build`: compilar a `dist/`.
- `npm run preview`: abrir la compilación local.
- `npm run lint`: comprobar el código.

Los pushes a `main` se publican con GitHub Pages mediante el workflow existente.

## Banner para el perfil de GitHub

La web genera `public/profile.svg` al arrancar y compilar. Usa el mismo nombre y retrato (`src/data/profile.json` y `public/portrait.webp`), fondo (`public/neon-noise.svg`) y fuente Anton. La foto se incrusta dentro del SVG para que no dependa de otra descarga. El SVG convierte las letras en trazados: no depende de fuentes externas, JavaScript ni estilos de GitHub. Su proporción 3:1 permite que nombre y año sigan siendo legibles en móvil.

Vista local: `http://127.0.0.1:5173/profile.svg`.

Añade este bloque al README del repositorio de perfil `jesusjodar/jesusjodar`:

```markdown
[![Jesus Jodar — Portfolio](https://jesusjodar.github.io/profile.svg)](https://jesusjodar.github.io/)
```

Después de cada push a `main`, GitHub Actions genera y publica el banner junto a la web. También se regenera a diario (02:15 UTC) y manualmente desde Actions para actualizar el año y la actividad. El README usa una URL estable; no necesita nuevos commits cuando cambia el diseño. GitHub puede tardar en refrescar su caché de imágenes.

- `npm run generate:readme`: regenerar solo el SVG.
- `public/profile.svg` es un resultado generado y no se versiona.
- Los cambios de CSS del sitio no se capturan automáticamente: el banner es una composición simplificada con su propio encuadre.

## Actividad de GitHub

El pie y el banner comparten un historial de hasta 365 días del calendario público de `jesusjodar`, incluido el día actual según Europe/Madrid. Se muestran dos filas con tantas columnas como caben entre el nombre y el año, de izquierda a derecha y de arriba abajo. El periodo visible corresponde a los días más recientes y cambia con el ancho disponible. Todos los cuadrados son blancos: opacidad mínima sin contribuciones y cuatro intensidades mayores según los niveles de GitHub. Cada celda muestra fecha y cantidad al pasar el cursor, sin enlaces ni interacción de clic.

`npm run generate:activity` consulta GitHub sin tokens y genera `src/data/github-activity.json` (ignorado por Git). También se ejecuta antes de iniciar y compilar. Si falla la red y existe un resultado anterior válido, se conserva indicando su periodo; sin datos previos, la generación falla en lugar de inventar actividad. El calendario público puede incluir actividad privada anonimizada si el perfil la tiene habilitada. El dato es una instantánea de cada compilación, no una consulta desde el navegador.

`public/side-artwork.svg` contiene el dibujo lateral sin fondo y con trazos negros puros. Su viewBox recorta la mitad derecha; la mitad izquierda queda alineada al borde derecho, ajustada al espacio sobre el pie.

Los cuadrados sociales son enlaces en la web (configurados en `src/data/social-icons.json`). En GitHub el banner se muestra como una imagen: los iconos internos no tienen enlaces individuales.
