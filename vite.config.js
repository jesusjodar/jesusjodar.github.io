import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Inyecta preload de la Anton latin (texto del LCP) con el nombre
// hasheado real del bundle, que no se conoce hasta compilar.
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'font-preload',
      transformIndexHtml(html, { bundle }) {
        const file = Object.keys(bundle || {}).find(
          (f) => f.includes('anton-latin-400-normal') && f.endsWith('.woff2'),
        )
        if (!file) return html
        const link = `  <link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin />\n`
        return html.replace('</head>', `${link}  </head>`)
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        // Vendors separados: caché diferencial y descargas en paralelo.
        // marked/DOMPurify solo salen en los chunks diferidos que los usan.
        advancedChunks: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            { name: 'ogl', test: /node_modules[\\/]ogl[\\/]/ },
            {
              name: 'markdown',
              test: /node_modules[\\/](marked|dompurify)[\\/]/,
            },
          ],
        },
      },
    },
  },
})
