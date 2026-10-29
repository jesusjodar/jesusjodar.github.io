# Jesús Jódar

Página mínima con fondo de ruido orgánico verde y amarillo neón, y pie negro puro (`#000000`) con firma y año.

React + Vite, con CSS propio y fuente variable Roboto Flex.

- `npm ci`: instalar las dependencias del archivo de bloqueo.
- `npm run dev`: iniciar el servidor de desarrollo.
- `npm run dev:views`: abrir la previsualización doble de desarrollo: desktop 1920 × 1080 a la izquierda e iPhone Air 420 × 912 CSS px a la derecha. Se escalan para caber sin alterar sus dimensiones internas. Esta vista comprueba el diseño responsive; no emula Safari ni el hardware del iPhone.
- `npm run build`: compilar a `dist/`.
- `npm run preview`: abrir la compilación local.
- `npm run lint`: comprobar el código.

Los pushes a `main` se publican con GitHub Pages mediante el workflow existente.

## Actividad de GitHub

El pie muestra un historial de hasta 365 días del calendario público de `jesusjodar`, incluido el día actual según Europe/Madrid. Se muestran dos filas con tantas columnas como caben entre el nombre y el año, de izquierda a derecha y de arriba abajo. El periodo visible corresponde a los días más recientes y cambia con el ancho disponible. Todos los cuadrados son blancos: opacidad mínima sin contribuciones y cuatro intensidades mayores según los niveles de GitHub. Cada celda muestra fecha y cantidad al pasar el cursor, sin enlaces ni interacción de clic.

`npm run generate:activity` consulta GitHub sin tokens y genera `src/data/github-activity.json` (ignorado por Git). También se ejecuta antes de iniciar y compilar. Si falla la red y existe un resultado anterior válido, se conserva indicando su periodo; sin datos previos, la generación falla en lugar de inventar actividad. El calendario público puede incluir actividad privada anonimizada si el perfil la tiene habilitada. El dato es una instantánea de cada compilación, no una consulta desde el navegador.

`public/side-artwork.svg` contiene el dibujo lateral sin fondo y con trazos negros puros. Su viewBox recorta la mitad derecha; la mitad izquierda queda alineada al borde derecho, ajustada al espacio sobre el pie.

Los cuadrados sociales son enlaces en la web (configurados en `src/data/social-icons.json`).
