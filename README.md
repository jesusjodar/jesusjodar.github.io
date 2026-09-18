# Jesús Jódar — Portfolio

![Portfolio de Jesús Jódar](assets/banner.jpg)

Portfolio personal interactivo con estética brutalista, cyberpunk y neón: currículum dentro de una carpeta que se colapsa para abrir un **chat que responde sobre mí**, pestaña de **blog** alimentada con Markdown y fondo animado con grano.

🌐 **Web en directo:** https://jesusjodar.github.io

## Qué incluye

- **CV interactivo** — foto con dithering y borde derretido precalculados, titular, barcode Code 39 dibujado a mano, sociales (LinkedIn, X, correo, WhatsApp) y secciones completas.
- **Chat sobre mí** — preguntas con sugerencias rotatorias y respuestas instantáneas por similitud semántica (TF-IDF + coseno + n-gramas) sobre una base de conocimiento en primera persona. Sin backend.
- **Blog** — pestañas CV/BLOG con cambio instantáneo; los posts salen de `posts/*.md` (primera línea = título, resto = cuerpo) con fechas de creación y contador de ediciones.
- **Fondo vivo** — gradiente animado (Grainient) con grano estático, marco-carpeta con outline squircle, pixelado y desenfoque progresivo al colapsar, y ondas pixeladas inferiores.
- **Tope de contenido** — el contenido se centra hasta 900px; los fondos siguen a sangre.

## Stack

React 19 + Vite 8 + Tailwind CSS 4 · `marked` + `dompurify` para Markdown · Font Awesome (iconos sociales) · fuentes Anton, Space Grotesk, Kalam, Bebas Neue y Libre Barcode vía Fontsource.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local (regenera `src/lib/posts.json` antes) |
| `npm run build` | Compilación a `dist/` (regenera posts antes) |
| `npm run lint` | Linter (`oxlint`) |
| `node scripts/collect-posts.js` | Recolecta `posts/*.md` → `src/lib/posts.json` (título, cuerpo, fechas, ediciones) |
| `python3 scripts/prerender-pfp.py <foto> [salida]` | Dithering + tinte neón + derretido de la foto |
| `python3 scripts/prerender-drip-tile.py [salida]` | Ondas pixeladas del fondo inferior |

## Añadir un post al blog

1. Crea `posts/mi-post.md`.
2. Primera línea: el título (vale `# Título`). Resto: cuerpo en Markdown.
3. Arranca o compila: las fechas salen de la metadata del archivo y las ediciones se detectan solas.

## Estructura

```
├── posts/              # Entradas del blog en Markdown
├── public/             # pfp-dither.png, drip-tile.png, favicon
├── scripts/            # collect-posts, prerender-pfp, prerender-drip-tile
└── src/
    ├── components/     # App, ChatPanel, CvContent, FolderFrame, ...
    ├── hooks/          # useChatAI, useFolderInset
    └── lib/            # portfolio, knowledgeBase, nlpEngine, posts.json
```

## Despliegue

Cada push a `main` compila y publica en GitHub Pages automáticamente (`.github/workflows/deploy.yml`). Solo hay que tener activado **Settings → Pages → Source: GitHub Actions**.
