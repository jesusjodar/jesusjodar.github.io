import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import POSTS from '../lib/posts.json'

// Misma config de Markdown que el chat (este chunk carga en diferido,
// así que se configura aquí y no depende del orden de carga).
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    link({ href, title, text }) {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  },
})

// Contenido del blog con la misma estética de textos del CV.
// Los posts salen de posts/*.md (scripts/collect-posts.js).
function formatPostDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BlogPost({ post }) {
  const html = useMemo(() => {
    if (!post.body) return ''
    const rawHtml = marked.parse(post.body)
    if (typeof window !== 'undefined' && DOMPurify?.sanitize) {
      return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target', 'rel'] })
    }
    return rawHtml
  }, [post.body])

  const edited = post.edits > 0
  return (
    <article>
      <h3 className="font-display text-2xl">{post.title}</h3>
      <p className="mt-2 text-sm text-white/60">
        {formatPostDate(post.created)}
        {edited
          ? ` · Editado ${post.edits} ${post.edits === 1 ? 'vez' : 'veces'}`
          : ''}
      </p>
      {html ? (
        <div
          className="chat-markdown mt-4 text-base leading-relaxed text-white"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </article>
  )
}

export default function BlogPlaceholder() {
  return (
    <div className="blog-scope">
      <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
        Blog
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white">
        Aquí iré publicando ideas, proyectos y cualquier tema que me parezca
        interesante o me ronde por la cabeza: sistemas, inteligencia
        artificial, automatización y todo lo que vaya aprendiendo por el camino.
      </p>
      {POSTS.length > 0 ? (
        <div className="mt-12 space-y-12">
          {POSTS.map((post) => (
            <BlogPost key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-base text-white/60">
          Aún no hay entradas. Estoy escribiendo las primeras.
        </p>
      )}
      <div className="mt-16 flex items-center gap-4">
        <div aria-hidden="true" className="h-1 flex-1 bg-white/30" />
        <p
          className="font-display text-lg tracking-wider"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Has llegado al final
        </p>
        <div aria-hidden="true" className="h-1 flex-1 bg-white/30" />
      </div>
    </div>
  )
}
